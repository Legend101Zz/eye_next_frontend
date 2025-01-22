export interface DashboardSettings {
  isPrivate?: boolean;
  showDesigns?: boolean;
  showFollowers?: boolean;
  showFullName?: boolean;
  showPhone?: boolean;
  showDescription?: boolean;
  showCoverPhoto?: boolean;
  showProfilePhoto?: boolean;
  designIds: string[]; // Make this required
  socialMediaLink1?: string;
  socialMediaLink2?: string;
  portfolioLink1?: string;
  portfolioLink2?: string;
}

export interface Design {}

export interface Product {}

export interface IFinalProductResponse {
  productId: string;
  baseProductName: string;
  mainImageUrl: string;
  otherImages: string[];
  price: number;
  category: string;
  color: string;
  sales: number;
  designs: {
    designName: string;
    designerName: string;
    position: "front" | "back";
    appliedImageUrl: string;
  }[];
}

export interface Product {
  mainImageUrl?: string;
  category?: string;
  color?: string;
  price?: number;
  productId?: string;
  otherImages?: Array<string>;
}

export interface ProductCardProps {
  mainImageUrl?: string;
  category?: string;
  color?: string;
  price?: number;
  productId?: string;
  otherImages?: Array<string>;
}

export type PageType = {
  currentPage: number;
  totalPages: number;
};

export type DesignCardProps = {
  _id: string;
  designImageUrl: string;
  designName: string;
  designerId: string;
  designerName: string;
};

export interface DesignerCardProps {
  totalDesigns: number;
  designerFollowers: number;
  designImageUrl: string;
  designName: string;
  designerId: string;
  designerName: string;
  profileImageUrl: string;
}

export interface CartItem {}

export interface ShirtColour {}

export interface ColorVariant {
  color: string;
  productId: string;
  mainImageUrl: string;
  otherImages: string[];
  price: number;
}

export interface UpdatedProductCardProps {
  productName: string;
  baseProductName: string;
  category: string;
  colorVariants: ColorVariant[];
  designs: {
    designId: string;
    designName: string;
    designerName: string;
    position: "front" | "back";
    appliedImageUrl: string;
  }[];
}
