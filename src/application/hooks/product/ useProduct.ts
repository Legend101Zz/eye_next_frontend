/**
 * Product Hook
 * @module application/hooks/product/useProduct
 *
 * @description
 * Primary hook for managing individual product data and operations.
 * Handles product retrieval, variants, pricing, and inventory management.
 *
 * Dependencies:
 * - ProductDto, ProductResponseDto from application layer
 * - IProductService from domain layer
 * - Product entity from domain layer
 */

import { useState, useCallback, useEffect } from "react";
import { IProductService } from "@/domain/ports/services/IProductService";
import {
  ProductDto,
  ProductResponseDto,
  ProductVariantDto,
  ProductPriceDto,
} from "@/application/dtos/product";
import {
  Product,
  ProductStatus,
  ProductCategory,
  Size,
  Color,
} from "@/domain/entities/product.entity";
import { ValidationError, NotFoundError } from "@/domain/common/errors";
import { toast } from "@/components/ui/use-toast";

export interface UseProductReturn {
  /** Product data */
  product: ProductResponseDto | null;
  /** Selected variant */
  selectedVariant: ProductVariantDto | null;
  /** Available variants */
  variants: ProductVariantDto[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
  /** Select variant */
  selectVariant: (options: { size?: Size; color?: Color }) => void;
  /** Check stock availability */
  checkStock: (variantId: string, quantity: number) => Promise<boolean>;
  /** Get pricing information */
  getPricing: (quantity: number) => ProductPriceDto;
  /** Get shipping estimates */
  getShippingEstimates: (zipCode: string) => Promise<ShippingEstimate[]>;
  /** Refresh product data */
  refreshProduct: () => Promise<void>;
}

/**
 * Hook for managing individual product
 *
 * @param productService - Instance of IProductService
 * @param productId - ID of the product to manage
 * @returns Product management functionality and state
 *
 * @example
 * ```tsx
 * const ProductPage = ({ productId }) => {
 *   const {
 *     product,
 *     selectedVariant,
 *     selectVariant,
 *     isLoading
 *   } = useProduct(productService, productId);
 *
 *   if (isLoading) return <Spinner />;
 *
 *   return (
 *     <div>
 *       <h1>{product?.name}</h1>
 *       <VariantSelector
 *         variants={variants}
 *         selected={selectedVariant}
 *         onSelect={selectVariant}
 *       />
 *     </div>
 *   );
 * };
 * ```
 */
export const useProduct = (
  productService: IProductService,
  productId: string,
): UseProductReturn => {
  const [product, setProduct] = useState<ProductResponseDto | null>(null);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantDto | null>(null);
  const [variants, setVariants] = useState<ProductVariantDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch product data
  const fetchProduct = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await productService.findById(productId);
      setProduct(response);
      setVariants(response.variants);

      // Set default variant if available
      if (response.variants.length > 0) {
        const defaultVariant =
          response.variants.find((v) => v.status.isDefault) ||
          response.variants[0];
        setSelectedVariant(defaultVariant);
      }

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
  }, [productId, productService]);

  // Load product on mount
  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  // Variant selection handler
  const selectVariant = useCallback(
    async (options: { size?: Size; color?: Color }) => {
      if (!variants.length) return;

      const matchingVariant = variants.find(
        (variant) =>
          (!options.size || variant.options.size === options.size) &&
          (!options.color || variant.options.color === options.color),
      );

      if (matchingVariant) {
        setSelectedVariant(matchingVariant);
      } else {
        toast({
          title: "Variant Not Available",
          description: "The selected combination is not available",
          variant: "warning",
        });
      }
    },
    [variants],
  );

  // Stock availability checker
  const checkStock = useCallback(
    async (variantId: string, quantity: number): Promise<boolean> => {
      try {
        const stockStatus = await productService.checkStock(
          variantId,
          quantity,
        );

        if (!stockStatus.inStock) {
          toast({
            title: "Out of Stock",
            description: `Only ${stockStatus.availableQuantity} units available`,
            variant: "warning",
          });
        }

        return stockStatus.inStock;
      } catch (err) {
        toast({
          title: "Error",
          description: "Could not check stock availability",
          variant: "destructive",
        });
        return false;
      }
    },
    [productService],
  );

  // Price calculator
  const getPricing = useCallback(
    (quantity: number): ProductPriceDto => {
      if (!selectedVariant) {
        throw new Error("No variant selected");
      }

      const basePrice = selectedVariant.pricing.basePrice;
      let finalPrice = basePrice * quantity;

      // Apply bulk discounts if available
      const bulkPricing = selectedVariant.pricing.bulkPricing;
      if (bulkPricing) {
        const applicableTier = bulkPricing
          .filter((tier) => tier.minQuantity <= quantity)
          .sort((a, b) => b.minQuantity - a.minQuantity)[0];

        if (applicableTier) {
          finalPrice = applicableTier.unitPrice * quantity;
        }
      }

      return {
        basePrice,
        quantity,
        subtotal: finalPrice,
        discount: basePrice * quantity - finalPrice,
        finalPrice,
      };
    },
    [selectedVariant],
  );

  // Shipping estimator
  const getShippingEstimates = useCallback(
    async (zipCode: string): Promise<ShippingEstimate[]> => {
      try {
        if (!selectedVariant) {
          throw new Error("No variant selected");
        }

        return await productService.getShippingEstimates(
          productId,
          selectedVariant.id,
          zipCode,
        );
      } catch (err) {
        toast({
          title: "Error",
          description: "Could not get shipping estimates",
          variant: "destructive",
        });
        return [];
      }
    },
    [productId, productService, selectedVariant],
  );

  return {
    product,
    selectedVariant,
    variants,
    isLoading,
    error,
    selectVariant,
    checkStock,
    getPricing,
    getShippingEstimates,
    refreshProduct: fetchProduct,
  };
};
