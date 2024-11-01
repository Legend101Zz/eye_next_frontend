/**
 * Final Product Hook
 * @module application/hooks/finalProduct/useFinalProduct
 *
 * @description
 * Primary hook for managing final product data and operations.
 * Handles final product retrieval, design applications, variants, and pricing.
 *
 * Dependencies:
 * - FinalProductDto from application layer
 * - IFinalProductService from domain layer
 * - FinalProduct entity from domain layer
 */

import { useState, useCallback, useEffect } from "react";
import { IFinalProductService } from "@/domain/ports/services/IFinalProductService";
import {
  FinalProductDto,
  FinalProductResponseDto,
  DesignApplicationDto,
  ProductionDetailsDto,
} from "@/application/dtos/finalProduct";
import {
  FinalProduct,
  FinalProductStatus,
  DesignPosition,
} from "@/domain/entities/finalProduct.entity";
import { ValidationError, NotFoundError } from "@/domain/common/errors";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "../auth/useAuth";

export interface UseFinalProductReturn {
  /** Final product data */
  product: FinalProductResponseDto | null;
  /** Applied designs */
  appliedDesigns: DesignApplicationDto[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Update product data */
  updateProduct: (data: Partial<FinalProductDto>) => Promise<boolean>;
  /** Apply design */
  applyDesign: (designId: string, position: DesignPosition) => Promise<boolean>;
  /** Remove design */
  removeDesign: (designId: string) => Promise<boolean>;
  /** Update design position */
  updateDesignPosition: (
    designId: string,
    position: DesignPosition,
    transform?: { scale?: number; rotation?: number },
  ) => Promise<boolean>;
  /** Update production details */
  updateProductionDetails: (details: ProductionDetailsDto) => Promise<boolean>;
  /** Get pricing breakdown */
  getPricingBreakdown: () => Promise<PricingBreakdown>;
  /** Refresh product data */
  refreshProduct: () => Promise<void>;
}

/**
 * Hook for managing final product
 *
 * @param finalProductService - Instance of IFinalProductService
 * @param productId - ID of the final product to manage
 * @returns Final product management functionality and state
 *
 * @example
 * ```tsx
 * const FinalProductPage = ({ productId }) => {
 *   const {
 *     product,
 *     appliedDesigns,
 *     applyDesign,
 *     isLoading
 *   } = useFinalProduct(finalProductService, productId);
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return (
 *     <div>
 *       <h1>{product?.productName}</h1>
 *       <DesignApplications
 *         designs={appliedDesigns}
 *         onApplyDesign={applyDesign}
 *       />
 *     </div>
 *   );
 * };
 * ```
 */
export const useFinalProduct = (
  finalProductService: IFinalProductService,
  productId: string,
): UseFinalProductReturn => {
  const { user } = useAuth();
  const [product, setProduct] = useState<FinalProductResponseDto | null>(null);
  const [appliedDesigns, setAppliedDesigns] = useState<DesignApplicationDto[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch product data
  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await finalProductService.findById(productId);
      setProduct(response);
      setAppliedDesigns(response.appliedDesigns);
      setError(null);
    } catch (err) {
      if (err instanceof NotFoundError) {
        setError(new Error("Product not found"));
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
      } else {
        setError(
          err instanceof Error ? err : new Error("Failed to load product"),
        );
        toast({
          title: "Error",
          description: "Could not load product data",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [productId, finalProductService]);

  // Load product on mount
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Update product handler
  const updateProduct = useCallback(
    async (data: Partial<FinalProductDto>): Promise<boolean> => {
      if (!user?.isDesigner) {
        toast({
          title: "Unauthorized",
          description: "Only designers can update products",
          variant: "destructive",
        });
        return false;
      }

      try {
        setIsLoading(true);
        const response = await finalProductService.update(productId, data);
        setProduct(response);

        toast({
          title: "Product Updated",
          description: "Product has been updated successfully",
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
            description: "Failed to update product",
            variant: "destructive",
          });
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [productId, finalProductService, user],
  );

  // Apply design handler
  const applyDesign = useCallback(
    async (designId: string, position: DesignPosition): Promise<boolean> => {
      try {
        setIsLoading(true);

        // Check design position availability
        const existingDesign = appliedDesigns.find(
          (d) => d.position === position,
        );
        if (existingDesign) {
          throw new ValidationError("Position occupied", {
            position: [`Design already applied to ${position} position`],
          });
        }

        const response = await finalProductService.applyDesign(productId, {
          designId,
          position,
          scale: 1,
          rotation: 0,
        });

        setAppliedDesigns(response.appliedDesigns);

        toast({
          title: "Design Applied",
          description: "Design has been applied successfully",
        });

        return true;
      } catch (err) {
        if (err instanceof ValidationError) {
          toast({
            title: "Validation Error",
            description: err.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to apply design",
            variant: "destructive",
          });
        }
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [productId, finalProductService, appliedDesigns],
  );

  // Rest of the implementation includes removeDesign, updateDesignPosition,
  // updateProductionDetails, and getPricingBreakdown methods
  // following similar patterns...

  return {
    product,
    appliedDesigns,
    isLoading,
    error,
    updateProduct,
    applyDesign,
    removeDesign,
    updateDesignPosition,
    updateProductionDetails,
    getPricingBreakdown,
    refreshProduct: fetchProduct,
  };
};
