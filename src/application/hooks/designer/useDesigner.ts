/**
 * Designer Hook
 * @module application/hooks/designer/useDesigner
 *
 * @description
 * Primary hook for managing designer data and operations.
 * Handles designer profile, portfolio, and basic analytics.
 *
 * Dependencies:
 * - DesignerDto, DesignerProfileDto from application layer
 * - IDesignerService from domain layer
 * - Designer entity from domain layer
 */

import { useState, useCallback, useEffect } from "react";
import { IDesignerService } from "@/domain/ports/services/IDesignerService";
import {
  DesignerProfileDto,
  DesignerSettingsDto,
  DesignerStatsDto,
  UpdateDesignerProfileRequestDto,
} from "@/application/dtos/designer";
import { Designer, VerificationLevel } from "@/domain/entities/designer.entity";
import { ValidationError, NotFoundError } from "@/domain/common/errors";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "../auth/useAuth";

export interface UseDesignerReturn {
  /** Designer profile data */
  designer: DesignerProfileDto | null;
  /** Designer statistics */
  stats: DesignerStatsDto | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Update profile */
  updateProfile: (data: UpdateDesignerProfileRequestDto) => Promise<boolean>;
  /** Update settings */
  updateSettings: (settings: Partial<DesignerSettingsDto>) => Promise<boolean>;
  /** Upload portfolio */
  uploadPortfolio: (files: File[]) => Promise<boolean>;
  /** Get portfolio */
  getPortfolio: () => Promise<string[]>;
  /** Get verification status */
  getVerificationStatus: () => Promise<VerificationLevel>;
  /** Refresh designer data */
  refreshDesigner: () => Promise<void>;
}

/**
 * Hook for managing designer data
 *
 * @param designerService - Instance of IDesignerService
 * @param designerId - ID of the designer to manage
 * @returns Designer management functionality and state
 *
 * @example
 * ```tsx
 * const DesignerProfile = ({ designerId }) => {
 *   const {
 *     designer,
 *     stats,
 *     updateProfile,
 *     isLoading
 *   } = useDesigner(designerService, designerId);
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return (
 *     <div>
 *       <h1>{designer?.artistName}</h1>
 *       <DesignerStats stats={stats} />
 *       <ProfileEditor
 *         designer={designer}
 *         onSave={updateProfile}
 *       />
 *     </div>
 *   );
 * };
 * ```
 */
export const useDesigner = (
  designerService: IDesignerService,
  designerId: string,
): UseDesignerReturn => {
  const { user } = useAuth();
  const [designer, setDesigner] = useState<DesignerProfileDto | null>(null);
  const [stats, setStats] = useState<DesignerStatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch designer data
  const fetchDesigner = useCallback(async () => {
    try {
      setIsLoading(true);

      // Fetch basic profile
      const profileResponse = await designerService.getProfile(designerId);
      setDesigner(profileResponse);

      // Fetch stats if authorized
      if (user?.id === designerId || user?.isDesigner) {
        const statsResponse = await designerService.getStats(designerId);
        setStats(statsResponse);
      }

      setError(null);
    } catch (err) {
      if (err instanceof NotFoundError) {
        setError(new Error("Designer not found"));
        toast({
          title: "Error",
          description: "Designer profile not found",
          variant: "destructive",
        });
      } else {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to load designer data"),
        );
        toast({
          title: "Error",
          description: "Could not load designer information",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [designerId, designerService, user]);

  // Initial load
  useEffect(() => {
    fetchDesigner();
  }, [fetchDesigner]);

  // Update profile handler
  const updateProfile = useCallback(
    async (data: UpdateDesignerProfileRequestDto): Promise<boolean> => {
      if (!user?.id || user.id !== designerId) {
        toast({
          title: "Unauthorized",
          description: "You cannot update this profile",
          variant: "destructive",
        });
        return false;
      }

      try {
        setIsLoading(true);
        const response = await designerService.updateProfile(designerId, data);
        setDesigner(response);

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
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [designerId, designerService, user],
  );

  // Update settings handler
  const updateSettings = useCallback(
    async (settings: Partial<DesignerSettingsDto>): Promise<boolean> => {
      if (!user?.id || user.id !== designerId) return false;

      try {
        setIsLoading(true);
        const response = await designerService.updateSettings(
          designerId,
          settings,
        );
        setDesigner((prev) =>
          prev ? { ...prev, settings: response.settings } : null,
        );

        toast({
          title: "Settings Updated",
          description: "Your settings have been updated successfully",
        });

        return true;
      } catch (err) {
        toast({
          title: "Update Failed",
          description: "Failed to update settings",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [designerId, designerService, user],
  );

  // Portfolio upload handler
  const uploadPortfolio = useCallback(
    async (files: File[]): Promise<boolean> => {
      if (!user?.id || user.id !== designerId) return false;

      try {
        setIsLoading(true);

        // Validate files
        const validFiles = files.filter((file) => {
          const isValid = file.type.startsWith("image/");
          if (!isValid) {
            toast({
              title: "Invalid File",
              description: `${file.name} is not an image file`,
              variant: "destructive",
            });
          }
          return isValid;
        });

        if (validFiles.length === 0) return false;

        await designerService.uploadPortfolio(designerId, validFiles);

        toast({
          title: "Portfolio Updated",
          description: "Your portfolio has been updated successfully",
        });

        return true;
      } catch (err) {
        toast({
          title: "Upload Failed",
          description: "Failed to upload portfolio images",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [designerId, designerService, user],
  );

  // Get portfolio handler
  const getPortfolio = useCallback(async (): Promise<string[]> => {
    try {
      const portfolio = await designerService.getPortfolio(designerId);
      return portfolio;
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not load portfolio",
        variant: "destructive",
      });
      return [];
    }
  }, [designerId, designerService]);

  // Verification status handler
  const getVerificationStatus =
    useCallback(async (): Promise<VerificationLevel> => {
      try {
        return await designerService.getVerificationStatus(designerId);
      } catch (err) {
        toast({
          title: "Error",
          description: "Could not check verification status",
          variant: "destructive",
        });
        return VerificationLevel.NONE;
      }
    }, [designerId, designerService]);

  return {
    designer,
    stats,
    isLoading,
    error,
    updateProfile,
    updateSettings,
    uploadPortfolio,
    getPortfolio,
    getVerificationStatus,
    refreshDesigner: fetchDesigner,
  };
};
