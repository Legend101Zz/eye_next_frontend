/**
 * Product color options available in the system
 */
export enum Color {
  BLACK = "black",
  WHITE = "white",
  RED = "red",
  BLUE = "blue",
  GREEN = "green",
  YELLOW = "yellow",
  NAVY = "navy",
  GRAY = "gray",
}

/**
 * Product categories available in the system
 */
export enum Category {
  SHIRT = "shirt",
  TSHIRT = "Tshirt",
  SWEATSHIRT = "sweatshirt",
  HOODIE = "hoodie",
  MUG = "mug",
  STICKER = "sticker",
  POSTER = "poster",
}

/**
 * Available size options for apparel products
 */
export enum Size {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
  XXL = "XXL",
}

/**
 * Gender categories for products
 */
export enum Gender {
  MALE = "male",
  FEMALE = "female",
  UNISEX = "unisex",
}

/**
 * Represents the image of the product with its position telling which side (portion) of product it shows
 */
export interface ProductImage {
  id: string;
  url: string;
  filename: string;
  position: "front" | "back";
}

/**
 * Represents a Product entity in the system
 */
export interface Product {
  id: string;
  name: string;
  quantity: number;
  color: Color[];
  category: Category;
  image: ProductImage[];
  sizes: Size[];
  basePrice: number;
  gender: Gender;
  createdAt: Date;
  updatedAt: Date;
}
