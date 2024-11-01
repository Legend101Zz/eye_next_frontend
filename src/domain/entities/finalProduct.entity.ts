import { Color, Category, Size, ProductImage, Gender } from "./product.entity";
/**
 * Final Product Domain Entities and Types
 */

/**
 * Represents a design applied to a specific position on a product
 */
export interface DesignApplication {
  id: string;
  designId: string; // Reference to Design
  designerId: string; // Reference to Designer who created the design
  position: "front" | "back";
  appliedImage: {
    url: string;
    filename: string;
    position: "front" | "back";
  };
}

/**
 * Represents a complete final product with designs applied
 */
export interface FinalProduct {
  id: string;
  productName: string; // Name of the final product
  price: number; // Final price including design value
  sales: number; // Number of units sold
  color: Color; // Color variant of base product
  category: Category; // Inherited from base product
  baseProductImages: ProductImage[]; // Images from base product
  appliedDesigns: DesignApplication[];
  productId: string; // Reference to base product
  sizes?: Size[]; // Available sizes (for apparel)
  gender?: Gender; // Inherited from base product
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Data required to create a new final product
 */
export interface CreateFinalProductData {
  baseProductId: string;
  designApplications: {
    designId: string;
    position: "front" | "back";
  }[];
  color: Color;
  price?: number; // Optional price adjustment from base price
}

/**
 * Final product response from API
 */
export interface IFinalProductResponse {
  productName: string;
  productId: string;
  baseProductName: string;
  mainImageUrl: string;
  otherImages: string[];
  price: number;
  category: string;
  color: string;
  sales: number;
  designs: Array<{
    designName: string;
    designerName: string;
    position: "front" | "back";
    appliedImageUrl: string;
  }>;
}

/**
 * Grouped product interface extending final product response
 */
export interface GroupedProduct extends Omit<IFinalProductResponse, "color"> {
  colors: Array<{
    color: string;
    productId: string;
  }>;
}
