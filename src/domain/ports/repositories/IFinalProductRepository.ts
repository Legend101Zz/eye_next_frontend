import { IBaseRepository } from "./IBaseRepository";
import {
  GroupedProduct,
  IFinalProductResponse,
} from "@/domain/entities/finalProduct.entity";

/**
 * Query parameters for filtering final products
 */
export interface FinalProductQueryParams {
  /** Filter by category */
  category?: string;
  /** Filter by color */
  color?: string;
  /** Page number */
  page?: number;
  /** Sales*/
  sales?: number;
}

/**
 * Final Product Repository Interface
 * Handles operations for products with applied designs
 */
export interface IFinalProductRepository {
  /**
   * Get paginated list of final products
   *
   * @param params - Query parameters
   * @returns Promise resolving to products grouped by design and category
   * @throws {DatabaseError} If query fails
   *
   * @example
   * ```typescript
   * const products = await finalProductRepo.getProducts({
   *   category: "t-shirt",
   *   page: 1
   * });
   * ```
   */
  getProducts(params: FinalProductQueryParams): Promise<GroupedProduct[]>;

  /**
   * Get single product details
   *
   * @param productId - Final product ID
   * @returns Promise resolving to product details
   * @throws {NotFoundError} If product doesn't exist
   */
  getSingleProduct(productId: string): Promise<IFinalProductResponse>;

  /**
   * Get categories without products for designer
   *
   * @param designerId - Designer ID
   * @param designImageUrl - Optional design image URL
   * @returns Promise resolving to available categories
   */
  getCategoriesWithoutProducts(
    designerId: string,
    designImageUrl?: string
  ): Promise<string[]>;

  /**
   * Get all products using a specific design
   *
   * @param designId - Design ID
   * @param params - Filter parameters
   * @returns Promise resolving to products and design URL
   */
  getProductsByDesign(
    designId: string,
    params?: {
      category?: string;
      color?: string;
    }
  ): Promise<{
    products: IFinalProductResponse[];
    designUrl: string;
  }>;

  /**
   * Get all products by designer
   *
   * @param designerId - Designer ID
   * @param params - Filter parameters
   * @returns Promise resolving to grouped products and designer name
   */
  getProductsByDesigner(
    designerId: string,
    params?: {
      category?: string;
      color?: string;
    }
  ): Promise<{
    products: GroupedProduct[];
    designerName: string;
  }>;

  /**
   * Get latest products
   *
   * @returns Promise resolving to latest grouped products
   */
  getLatestProducts(): Promise<GroupedProduct[]>;

  /**
   * Create new final product
   *
   * @param data - Product creation data
   * @param files - Product images
   * @returns Promise resolving to created product
   * @throws {ValidationError} If data is invalid
   */
  createFinalProduct(
    data: {
      productId: string;
      productName: string;
      price: number;
      color: string;
      designApplications: Array<{
        designImageUrl: string;
        position: "front" | "back";
      }>;
    },
    files: File[]
  ): Promise<IFinalProductResponse>;
}
