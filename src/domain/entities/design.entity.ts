/**
 * Design Domain Entities and Types
 */

/**
 * Represents an design image in the system
 */
export interface DesignImage {
  id: string;
  url: string;
  filename: string;
}

/**
 * Represents where this design has been applied
 * Maps to the DesignApplication in FinalProduct
 */
export interface DesignUsage {
  finalProductId: string; // Reference to FinalProduct
  position: "front" | "back";
  appliedImage: {
    url: string;
    filename: string;
    position: "front" | "back";
  };
}

/**
 * Represents a Design entity in the system
 */
export interface Design {
  id: string;
  title: string;
  description?: string;
  designImage: DesignImage[]; // Original design images
  designerId: string; // Reference to Designer who created the design
  finalProduct: string[]; // References to FinalProducts using this design
  isVerified: boolean;
  likes: number;
  appliedCoundt: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
