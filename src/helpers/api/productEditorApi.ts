import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
const DEFAULT_HEADERS = {
  "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  "Content-Type": "application/json",
};

export interface ProductImage {
  url: string;
  filename: string;
  position: "front" | "back" | "side" | "detail";
  color: string;
}

export interface Product {
  id: string;
  name: string;
  productType: string;
  category: string;
  colors: string[];
  images: ProductImage[];
  sizes: string[];
  gender?: string[];
}

export const getClothingProducts = async (
  gender?: string
): Promise<Product[]> => {
  try {
    const response = await axios({
      method: "GET",
      headers: DEFAULT_HEADERS,
      url: `${API_URL}/api/products/by-type`,
      params: {
        type: "clothing",
        gender: gender || undefined,
      },
    });

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to fetch products");
    }

    return response.data.products;
  } catch (error) {
    console.error("Error fetching clothing products:", error);
    throw error;
  }
};

// will append it further to allow designer use more than 10 designs at a time
export const getDesignerDesigns = async (designerId: string) => {
  try {
    const response = await axios({
      method: "GET",
      headers: DEFAULT_HEADERS,
      url: `${API_URL}/api/designer/design-images/${designerId}?isVerified=true&limit=10`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching designer designs:", error);
    throw error;
  }
};

export const getDesignById = async (designId: string) => {
  try {
    const response = await axios({
      method: "GET",
      headers: DEFAULT_HEADERS,
      url: `${API_URL}/api/designs/details/${designId}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching design details:", error);
    throw error;
  }
};

export const createFinalProduct = async (productData: FormData) => {
  try {
    const response = await axios({
      method: "POST",
      url: `${API_URL}/api/finalproduct/create`,
      data: productData,
      headers: {
        ...DEFAULT_HEADERS,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating final product:", error);
    throw error;
  }
};
