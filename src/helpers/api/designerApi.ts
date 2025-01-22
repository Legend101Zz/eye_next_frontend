import axios from "axios";

// API base URL from environment variable with fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Common headers for all requests
const DEFAULT_HEADERS = {
  "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
  "Content-Type": "application/json",
};

// Types for API responses and requests
interface DesignerRequest {
  userId: string;
  fullname: string;
  artistName: string;
  description?: string;
  portfolioLinks?: string[];
  cvLinks?: string[];
  phone: string;
  panCardNumber: string;
  addressBody: any; // TODO: Define proper address interface
}

interface DesignerSettings {
  isPrivate?: boolean;
  showDesigns?: boolean;
  designIds?: string[];
  showFollowers?: boolean;
  showFullName?: boolean;
  showPhone?: boolean;
  showDescription?: boolean;
  showCoverPhoto?: boolean;
  showProfilePhoto?: boolean;
  socialMediaLinks?: string[];
  portfolioLinks?: string[];
}

/**
 * Get random designers for discovery/showcase
 * @returns Array of random designer profiles
 */
export const getRandomDesigners = async () => {
  try {
    const response = await axios({
      method: "GET",
      headers: DEFAULT_HEADERS,
      url: `${API_URL}/api/designer/getRandomDesigner`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching random designers:", error);
    throw error;
  }
};

/**
 * Get public profile data for a designer
 * @param designerId ID of the designer
 * @returns Public profile data
 */
export const getDesignerPublicProfile = async (designerId: string) => {
  if (!designerId) {
    throw new Error("Designer ID is required");
  }

  try {
    const response = await axios({
      method: "GET",
      headers: DEFAULT_HEADERS,
      url: `${API_URL}/api/designer/viewProfile/${designerId}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching designer public profile:", error);
    throw error;
  }
};

/**
 * Get personal/private profile data for a designer
 * @param designerId ID of the designer
 * @returns Personal profile data
 */
export const getDesignerPersonalData = async (designerId: string) => {
  if (!designerId) {
    throw new Error("Designer ID is required");
  }

  try {
    const response = await axios({
      method: "GET",
      headers: DEFAULT_HEADERS,
      url: `${API_URL}/api/designer/personalProfile/${designerId}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching designer personal data:", error);
    throw error;
  }
};

/**
 * Get all designs by a designer
 * @param designerId ID of the designer
 * @returns Array of designs
 */
export const getDesignerDesigns = async (designerId: string) => {
  try {
    const response = await axios({
      method: "GET",
      headers: DEFAULT_HEADERS,
      url: `${API_URL}/api/designer/design-images/${designerId}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching designer designs:", error);
    throw error;
  }
};

/**
 * Submit a new designer registration request
 * @param data Designer registration data
 * @returns Response from registration request
 */
export const requestDesigner = async (data: DesignerRequest) => {
  try {
    const formData = new FormData();
    // Append all data fields to FormData
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, item));
      } else if (value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    const response = await axios({
      method: "POST",
      headers: {
        ...DEFAULT_HEADERS,
        "Content-Type": "multipart/form-data",
      },
      url: `${API_URL}/api/designer/request`,
      data: formData,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting designer request:", error);
    throw error;
  }
};

/**
 * Upload a profile photo for a designer
 * @param designerId ID of the designer
 * @param photoFile Photo file to upload
 * @returns Updated designer profile data
 */
export const uploadProfilePhoto = async (
  designerId: string,
  photoFile: File
) => {
  try {
    const formData = new FormData();
    formData.append("designerId", designerId);
    formData.append("photo", photoFile);

    const response = await axios({
      method: "POST",
      headers: {
        ...DEFAULT_HEADERS,
        "Content-Type": "multipart/form-data",
      },
      url: `${API_URL}/api/designer/addProfilePhoto`,
      data: formData,
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    throw error;
  }
};

/**
 * Get designer profile settings
 * @param designerId ID of the designer
 * @returns Designer settings data
 */
export const getDesignerSettings = async (designerId: string) => {
  try {
    const response = await axios({
      method: "GET",
      headers: DEFAULT_HEADERS,
      url: `${API_URL}/api/designer/show-designer-settings/${designerId}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching designer settings:", error);
    throw error;
  }
};

/**
 * Update designer profile settings
 * @param designerId ID of the designer
 * @param settings Settings data to update
 * @returns Updated settings data
 */
export const updateDesignerSettings = async (
  designerId: string,
  settings: DesignerSettings
) => {
  try {
    const response = await axios({
      method: "POST",
      headers: DEFAULT_HEADERS,
      url: `${API_URL}/api/designer/update-settings/${designerId}`,
      data: { settings },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating designer settings:", error);
    throw error;
  }
};

/**
 * Follow a designer
 * @param userId ID of the user following
 * @param designerId ID of the designer to follow
 * @returns Response data from follow request
 */
export const followDesigner = async (userId: string, designerId: string) => {
  try {
    const response = await axios({
      method: "POST",
      headers: DEFAULT_HEADERS,
      url: `${API_URL}/api/user/follow`,
      data: { userId, designerId },
    });
    return response.data;
  } catch (error) {
    console.error("Error following designer:", error);
    throw error;
  }
};

// Error handler type for consistent error handling
export type ApiError = {
  message: string;
  status?: number;
  details?: any;
};

// Custom error handler function
export const handleApiError = (error: any): ApiError => {
  if (axios.isAxiosError(error)) {
    return {
      message:
        error.response?.data?.message || "An error occurred with the request",
      status: error.response?.status,
      details: error.response?.data,
    };
  }
  return {
    message: error.message || "An unexpected error occurred",
    details: error,
  };
};

interface CreateDesignData {
  title: string;
  description?: string;
  tags: string[];
  designImage: File;
  productId?: string;
}

export const createDesign = async (
  designerId: string,
  data: CreateDesignData
) => {
  try {
    const formData = new FormData();
    formData.append("designerId", designerId);
    formData.append("title", data.title);
    if (data.description) {
      formData.append("description", data.description);
    }
    // Ensure tags are sent as an array
    data.tags.forEach((tag) => {
      formData.append("tags[]", tag.trim());
    });
    if (data.productId) {
      formData.append("productId", data.productId);
    }
    // Append the design image file
    formData.append("image", data.designImage);
    console.log("checking3", designerId, data);
    const response = await axios({
      method: "POST",
      headers: {
        ...DEFAULT_HEADERS,
        "Content-Type": "multipart/form-data",
      },
      url: `${API_URL}/api/designer/createDesign`,
      data: formData,
    });
    return response.data;
  } catch (error) {
    // Handle specific error cases
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 400) {
        throw new Error(
          error.response.data.message || "Invalid design data provided"
        );
      } else if (error.response?.status === 403) {
        throw new Error("Designer not approved");
      } else if (error.response?.status === 404) {
        throw new Error("Designer or product not found");
      }
    }
    console.error("Error creating design:", error);
    throw error;
  }
};

export interface DesignDetails {
  title: string;
  description: string;
  designImage: Array<{
    url: string;
    filename: string;
  }>;
  designer: {
    legal_first_name: string;
    legal_last_name: string;
    artistName: string;
  };
  finalProduct?: {
    name: string;
    category: string;
    price: number;
  }[];
  isVerified: boolean;
  likes: number;
  appliedCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const getDesignDetails = async (
  designId: string
): Promise<DesignDetails> => {
  if (!designId) {
    throw new Error("Design ID is required");
  }

  try {
    const response = await axios({
      method: "GET",
      headers: DEFAULT_HEADERS,
      url: `${API_URL}/api/designs/details/${designId}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching design details:", error);
    throw handleApiError(error);
  }
};
