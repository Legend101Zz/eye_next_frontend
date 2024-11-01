import { IBaseRepository } from "./IBaseRepository";
import {
  Product,
  Gender,
  Color,
  Category,
  ProductImage,
} from "@/domain/entities/product.entity";

/**
 * Product query parameters interface
 * Used for filtering and searching products
 */
export interface ProductQueryParams {
  /** Filter by product name */
  name?: string;

  /** Filter by product category */
  category?: Category;

  /** Filter by product gender */
  gender?: Gender;

  /** Filter by product color */
  color?: Color;

  /** Filter by available sizes */
  sizes?: string[];

  /** Filter by stock status */
  inStock?: boolean;
}

/**
 * Product statistics interface
 * Contains aggregated product data
 */
export interface ProductStatistics {
  /** Total number of products */
  totalProducts: number;
  /** Number of out of stock products */
  outOfStock: number;
  /** Average product price */
  averagePrice: number;
  /** Total sales amount */
  totalSales: number;
}

/**
 * Product Repository Interface
 * Handles all product-related data operations
 * Implements business logic for products including creation, updates,
 * image management, color management, and querying.
 *
 * @extends {IBaseRepository<Product>}
 */
export interface IProductRepository extends IBaseRepository<Product> {
  /**
   * Create a new product with images
   * Handles multipart form data for product creation including image uploads
   *
   * @param data - Product data including images
   * @returns Promise resolving to created product
   * @throws {ValidationError} If product data is invalid
   * @throws {UploadError} If image upload fails
   *
   * @example
   * ```typescript
   * const newProduct = await productRepo.create({
   *   name: "Classic Tee",
   *   category: "t-shirt",
   *   images: [file1, file2],
   *   price: 29.99
   * });
   * ```
   */
  create(data: Omit<Product, "id">): Promise<Product>;

  /**
   * Find product by ID
   * Retrieves complete product information including images
   *
   * @param id - Product ID
   * @returns Promise resolving to product or null
   * @throws {NotFoundError} If product doesn't exist
   *
   * @example
   * ```typescript
   * const product = await productRepo.findById("prod123");
   * ```
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Update product quantity
   * Modifies stock level for a product
   *
   * @param productId - Product ID
   * @param quantity - New quantity
   * @returns Promise resolving to void
   * @throws {NotFoundError} If product doesn't exist
   * @throws {ValidationError} If quantity is invalid
   *
   * @example
   * ```typescript
   * await productRepo.updateStock("prod123", 100);
   * ```
   */
  updateStock(productId: string, quantity: number): Promise<void>;

  /**
   * Add color to product
   * Adds a new color variant to product
   *
   * @param productId - Product ID
   * @param color - Color to add
   * @returns Promise resolving to updated product
   * @throws {NotFoundError} If product doesn't exist
   *
   * @example
   * ```typescript
   * const updated = await productRepo.addColor("prod123", "blue");
   * ```
   */
  addColor(productId: string, color: Color): Promise<Product>;

  /**
   * Remove color from product
   * Removes a color variant from product
   *
   * @param productId - Product ID
   * @param color - Color to remove
   * @returns Promise resolving to updated product
   * @throws {NotFoundError} If product doesn't exist
   *
   * @example
   * ```typescript
   * const updated = await productRepo.deleteColor("prod123", "blue");
   * ```
   */
  deleteColor(productId: string, color: Color): Promise<Product>;

  /**
   * Add images to product
   * Uploads and associates new images with product
   *
   * @param productId - Product ID
   * @param images - Array of image files to upload
   * @returns Promise resolving to updated product
   * @throws {NotFoundError} If product doesn't exist
   * @throws {UploadError} If image upload fails
   *
   * @example
   * ```typescript
   * const updated = await productRepo.addProductImages("prod123", [file1, file2]);
   * ```
   */
  addProductImages(productId: string, images: File[]): Promise<Product>;

  /**
   * Get product images filtered by color and/or category
   * Retrieves product images with optional filtering
   *
   * @param params - Filter parameters
   * @returns Promise resolving to array of product images
   *
   * @example
   * ```typescript
   * const images = await productRepo.getProductImages({
   *   color: "blue",
   *   category: "t-shirt"
   * });
   * ```
   */
  getProductImages(params: { color?: Color; category?: Category }): Promise<
    Array<{
      productId: string;
      imageUrls: string[];
    }>
  >;

  /**
   * Get colors available for a category
   * Retrieves all unique colors used in a product category
   *
   * @param category - Product category
   * @returns Promise resolving to array of colors
   *
   * @example
   * ```typescript
   * const colors = await productRepo.getColorsByCategory("t-shirt");
   * ```
   */
  getColorsByCategory(category: Category): Promise<Color[]>;

  /**
   * Find products by name and gender
   * Searches for products matching name with optional gender filter
   *
   * @param params - Search parameters
   * @returns Promise resolving to array of matching products
   *
   * @example
   * ```typescript
   * const products = await productRepo.getProductByName({
   *   name: "Classic Tee",
   *   gender: "unisex"
   * });
   * ```
   */
  getProductByName(params: {
    name: string;
    gender?: Gender;
  }): Promise<Product[]>;

  /**
   * Search products by query parameters
   * Advanced product search with multiple filters
   *
   * @param params - Query parameters
   * @returns Promise resolving to matching products
   * @throws {ValidationError} If query parameters are invalid
   *
   * @example
   * ```typescript
   * const products = await productRepo.searchProducts({
   *   category: "t-shirt",
   *   color: "blue",
   *   inStock: true
   * });
   * ```
   */
  searchProducts(params: ProductQueryParams): Promise<Product[]>;

  /**
   * Check product stock status
   * Verifies if product is in stock and gets quantity
   *
   * @param productId - Product ID to check
   * @returns Promise resolving to stock status
   * @throws {NotFoundError} If product doesn't exist
   *
   * @example
   * ```typescript
   * const stock = await productRepo.checkStock("prod123");
   * console.log(stock.quantity); // Current stock level
   * ```
   */
  checkStock(productId: string): Promise<{
    inStock: boolean;
    quantity: number;
  }>;
}
