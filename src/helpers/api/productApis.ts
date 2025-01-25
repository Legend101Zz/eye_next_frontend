import axios, { AxiosError } from "axios";

export enum Gender {
  MALE = "male",
  FEMALE = "female",
  UNISEX = "unisex",
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "token";

// Common types
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

interface QueryFilters {
  category?: string;
  gender?: Gender;
  productName?: string;
  designId?: string;
}

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "x-api-key": API_KEY,
  },
});

// Error handler utility
const handleApiError = (error: AxiosError) => {
  console.error("API Error:", error.response?.data || error.message);
  throw error;
};

/**
 * Get all products with optional filters
 */
export const getFilteredProducts = async (filters?: QueryFilters) => {
  try {
    const response = await api.get("/finalproduct/list", { params: filters });
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};

/**
 * Get processed images with optional filters
 */
export const getProcessedImages = async (filters?: QueryFilters) => {
  try {
    const response = await api.get("/finalproduct/images", { params: filters });
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};

/**
 * Get single product details
 */
export const getProductDetails = async (productId: string) => {
  try {
    const response = await api.get(`/finalproduct/${productId}`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};

/**
 * Update stock levels for a product variant
 */
interface StockUpdateParams {
  groupId: string;
  baseProductId: string;
  color: string;
  size: string;
  quantity: number;
}

export const updateProductStock = async (
  productId: string,
  params: StockUpdateParams
) => {
  try {
    const response = await api.patch(
      `/finalproduct/${productId}/stock`,
      params
    );
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};

/**
 * Deactivate a product
 */
export const deactivateProduct = async (productId: string) => {
  try {
    const response = await api.patch(`/finalproduct/${productId}/deactivate`);
    return response.data;
  } catch (error) {
    handleApiError(error as AxiosError);
  }
};

// Example usage with error handling:
// try {
//   const products = await getFilteredProducts({ category: 'tshirt', gender: 'MALE' });
//   console.log(products);
// } catch (error) {
//   if (error instanceof AxiosError) {
//     // Handle specific API errors
//     console.error('API Error:', error.response?.data?.message);
//   } else {
//     // Handle other errors
//     console.error('Unexpected error:', error);
//   }
// }
