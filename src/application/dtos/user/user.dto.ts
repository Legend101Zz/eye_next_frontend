/**
 * User authentication DTOs
 */
export interface LoginCredentialsDto {
  email: string;
  password: string;
}

export interface SignupCredentialsDto {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponseDto {
  message: string;
  data?: {
    id: string;
    email: string;
    username: string;
    isDesigner: boolean;
    designerId?: string;
  };
}

/**
 * User profile DTOs
 */
export interface UserProfileDto {
  phone?: string;
  name?: string;
  description?: string;
  username?: string;
}

export interface UserInfoDto {
  username: string;
  email: string;
  phone?: string;
  name?: string;
  description?: string;
}

/**
 * Address DTOs
 */
export interface AddressDto {
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: "home" | "work" | "other";
}

/**
 * Cart DTOs
 */
export interface CartItemDto {
  product: {
    productId: string;
    prodImageUrl: string;
    price: number;
    color: string;
    category: string;
  };
  quantity: number;
}
