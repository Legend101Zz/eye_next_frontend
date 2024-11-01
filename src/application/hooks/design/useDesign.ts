/**
 * Design Hook
 * @module application/hooks/design/useDesign
 *
 * @description
 * Primary hook for managing individual design data and operations.
 * Handles design retrieval, updating, and status management.
 *
 * Dependencies:
 * - DesignDto, DesignResponseDto from application layer
 * - IDesignService from domain layer
 * - Design entity from domain layer
 */

import { useState, useCallback, useEffect } from "react";
import { IDesignRepository } from "@/domain/ports/repositories/IDesignRepository";
import {
  DesignDto,
  DesignResponseDto,
  UpdateDesignRequestDto,
  DesignVerification,
} from "@/application/dtos/design/DesignDto";
import { Design, DesignVisibility } from "@/domain/entities/design.entity";
import { ValidationError, NotFoundError } from "@/domain/common/errors";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "../auth/useAuth";

export interface UseDesignReturn {
  /** Design data */
  design: DesignResponseDto | null;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Update design data */
  updateDesign: (data: UpdateDesignRequestDto) => Promise<boolean>;
  /** Update design visibility */
  updateVisibility: (visibility: DesignVisibility) => Promise<boolean>;
  /** Delete design */
  deleteDesign: () => Promise<boolean>;
  /** Submit design for verification */
  submitForVerification: () => Promise<boolean>;
  /** Get design usage statistics */
  getDesignUsage: () => Promise<DesignUsage>;
  /** Refresh design data */
  refreshDesign: () => Promise<void>;
}

/**
 * Hook for managing individual design
 *
 * @param designService - Instance of IDesignService
 * @param designId - ID of the design to manage
 * @returns Design management functionality and state
 *
 * @example
 * ```tsx
 * const DesignPage = ({ designId }) => {
 *   const { design, isLoading, updateDesign } = useDesign(designService, designId);
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return (
 *     <div>
 *       <h1>{design?.title}</h1>
 *       <DesignEditor design={design} onSave={updateDesign} />
 *     </div>
 *   );
 * };
 * ```
 */
export const useDesign = (
  designService: IDesignRepository,
  designId: string,
): UseDesignReturn => {
  const { user } = useAuth();
  const [design, setDesign] = useState<DesignResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch design data
  const fetchDesign = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await designService.findById(designId);
      setDesign(response);
      setError(null);
    } catch (err) {
      if (err instanceof NotFoundError) {
        setError(new Error("Design not found"));
        toast({
          title: "Error",
          description: "Design not found",
          variant: "destructive",
        });
      } else {
        setError(
          err instanceof Error ? err : new Error("Failed to load design"),
        );
        toast({
          title: "Error",
          description: "Could not load design data",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [designId, designService]);

  // Load design on mount and ID change
  useEffect(() => {
    fetchDesign();
  }, [fetchDesign]);

  // Update design handler
  const updateDesign = useCallback(
    async (data: UpdateDesignRequestDto): Promise<boolean> => {
      if (!design || !user?.id) return false;

      try {
        setIsLoading(true);

        // Verify ownership
        if (design.designer.id !== user.id) {
          throw new Error("Unauthorized to update this design");
        }

        const response = await designService.update(designId, data);
        setDesign(response);

        toast({
          title: "Design Updated",
          description: "Your design has been updated successfully",
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
            description: "Failed to update design",
            variant: "destructive",
          });
        }
        setError(
          err instanceof Error ? err : new Error("Failed to update design"),
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [design, designId, user?.id, designService],
  );

  // Update visibility handler
  const updateVisibility = useCallback(
    async (visibility: DesignVisibility): Promise<boolean> => {
      if (!design || !user?.id) return false;

      try {
        setIsLoading(true);
        const response = await designService.updateVisibility(
          designId,
          visibility,
        );
        setDesign(response);

        toast({
          title: "Visibility Updated",
          description: `Design is now ${visibility.toLowerCase()}`,
        });

        return true;
      } catch (err) {
        toast({
          title: "Update Failed",
          description: "Failed to update visibility",
          variant: "destructive",
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [design, designId, user?.id, designService],
  );

  // Delete design handler
  const deleteDesign = useCallback(async (): Promise<boolean> => {
    if (!design || !user?.id) return false;

    try {
      setIsLoading(true);
      await designService.delete(designId);

      toast({
        title: "Design Deleted",
        description: "Your design has been deleted successfully",
      });

      return true;
    } catch (err) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete design",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [design, designId, user?.id, designService]);

  // Submit for verification handler
  const submitForVerification = useCallback(async (): Promise<boolean> => {
    if (!design || !user?.id) return false;

    try {
      setIsLoading(true);
      const response = await designService.submitForVerification(designId);
      setDesign(response);

      toast({
        title: "Design Submitted",
        description: "Your design has been submitted for verification",
      });

      return true;
    } catch (err) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit design for verification",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [design, designId, user?.id, designService]);

  return {
    design,
    isLoading,
    error,
    updateDesign,
    updateVisibility,
    deleteDesign,
    submitForVerification,
    getDesignUsage,
    refreshDesign: fetchDesign,
  };
};
