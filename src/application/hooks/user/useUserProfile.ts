/**
 * User Profile Hook
 * @module application/hooks/user/useUserProfile
 *
 * @description
 * Hook for managing user profile data and operations.
 * Handles profile viewing, updating, and image management.
 *
 * Dependencies:
 * - UserProfileDto, UpdateProfileRequestDto from application layer
 * - UserService from infrastructure layer
 * - User entity from domain layer
 */

import { useState, useCallback, useEffect } from "react";
import { IUserRepository } from "@/domain/ports/repositories/IUserRepository";
import {
  UserProfileDto,
  UpdateProfileRequestDto,
  UpdateProfileResponseDto,
} from "@/application/dtos/user/UserProfileDto";
import { ValidationError, NotFoundError } from "@/domain/common/errors";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "../auth/useAuth";

export interface UseUserProfileReturn {
  /** User profile data */
  profile: UserProfileDto | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Update profile function */
  updateProfile: (data: UpdateProfileRequestDto) => Promise<boolean>;
  /** Upload profile picture */
  uploadProfilePicture: (file: File) => Promise<boolean>;
  /** Refresh profile data */
  refreshProfile: () => Promise<void>;
}

/**
 * Hook for managing user profile
 *
 * @param userService - Instance of IUserService
 * @returns Profile management functionality and state
 *
 * @example
 * ```tsx
 * const ProfilePage = () => {
 *   const { profile, isLoading, updateProfile } = useUserProfile(userService);
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return (
 *     <div>
 *       <h1>Welcome {profile?.name}</h1>
 *       <ProfileUpdateForm onSubmit={updateProfile} />
 *     </div>
 *   );
 * };
 * ```
 */
export const useUserProfile = (
  userService: IUserRepository,
): UseUserProfileReturn => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfileDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch user profile
  const fetchProfile = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const response = await userService.getProfile(user.id);
      setProfile(response);
      setError(null);
    } catch (err) {
      if (err instanceof NotFoundError) {
        setError(new Error("Profile not found"));
        toast({
          title: "Error",
          description: "Could not load profile",
          variant: "destructive",
        });
      } else {
        setError(
          err instanceof Error ? err : new Error("Failed to load profile"),
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, userService]);

  // Load profile on mount and user change
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update profile handler
  const updateProfile = useCallback(
    async (data: UpdateProfileRequestDto): Promise<boolean> => {
      if (!user?.id) return false;

      try {
        setIsLoading(true);

        const response = await userService.updateProfile(user.id, data);
        setProfile(response.profile);

        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });

        return true;
      } catch (err) {
        if (err instanceof ValidationError) {
          toast({
            title: "Validation Error",
            description: "Please check your input",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Update Failed",
            description: "Failed to update profile",
            variant: "destructive",
          });
        }
        setError(
          err instanceof Error ? err : new Error("Failed to update profile"),
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, userService],
  );

  // Profile picture upload handler
  const uploadProfilePicture = useCallback(
    async (file: File): Promise<boolean> => {
      if (!user?.id) return false;

      try {
        setIsLoading(true);

        // Validate file
        if (!file.type.startsWith("image/")) {
          throw new ValidationError("Invalid file type", {
            file: ["Please upload an image file"],
          });
        }

        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
          throw new ValidationError("File too large", {
            file: ["Image must be less than 5MB"],
          });
        }

        const response = await userService.uploadProfilePicture(user.id, file);
        setProfile((prev) =>
          prev ? { ...prev, picture: response.picture } : null,
        );

        toast({
          title: "Picture Updated",
          description: "Your profile picture has been updated",
        });

        return true;
      } catch (err) {
        if (err instanceof ValidationError) {
          toast({
            title: "Invalid File",
            description: err.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Upload Failed",
            description: "Failed to upload profile picture",
            variant: "destructive",
          });
        }
        setError(
          err instanceof Error ? err : new Error("Failed to upload picture"),
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [user?.id, userService],
  );

  return {
    profile,
    isLoading,
    error,
    updateProfile,
    uploadProfilePicture,
    refreshProfile: fetchProfile,
  };
};
