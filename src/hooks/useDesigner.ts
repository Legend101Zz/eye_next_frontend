import { useState, useEffect, useCallback } from "react";
import {
  getRandomDesigners,
  handleApiError,
  type ApiError,
} from "@/helpers/api/designerApi";

// Types
interface Design {
  _id: string;
  designImage: Array<{
    url: string;
    filename: string;
  }>;
  title: string;
  designerName: string;
  designerId: string;
  description?: string;
}

interface DesignerProfileData {
  profileImage: {
    url: string;
    filename: string;
  } | null;
  coverImage: {
    url: string;
    filename: string;
  } | null;
  totalDesigns: number;
  followers: number;
  Designs: Design[];
  artistName: string;
  _id: string;
  fullname: string;
}

/**
 * Hook for fetching and managing random designs
 */
export const useRandomDesigns = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchRandomDesigns = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRandomDesigners();

      // Transform the data to match the Design interface
      const formattedDesigns = data.map((item: any) => ({
        _id: item.designId,
        designImage: [{ url: item.designImage, filename: "" }],
        title: item.designName,
        designerName: item.designerName,
        designerId: item.designerId,
      }));

      setDesigns(formattedDesigns);
    } catch (err) {
      const handledError = handleApiError(err);
      setError(handledError);
      console.error("Error fetching random designs:", handledError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomDesigns();
  }, [fetchRandomDesigns]);

  return {
    loading,
    designs,
    error,
    refreshDesigns: fetchRandomDesigns,
  } as const;
};

/**
 * Hook for fetching and managing designer profile data
 */
export const useDesignerPhotos = () => {
  const [designerData, setDesignerData] = useState<DesignerProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchDesignerData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRandomDesigners();

      // Transform the data to match the DesignerProfileData interface
      const formattedData = data.map((designer: any) => ({
        profileImage: designer.profileImage
          ? {
              url: designer.profileImage,
              filename: "",
            }
          : null,
        coverImage: designer.coverImage
          ? {
              url: designer.coverImage,
              filename: "",
            }
          : null,
        totalDesigns: designer.totalDesigns || 0,
        followers: designer.designerFollowers || 0,
        Designs: designer.Designs || [],
        artistName: designer.designerName,
        _id: designer.designerId,
        fullname: designer.designerName,
      }));
      // console.log("designerData", formattedData);
      
      // console.log("designerData22", data);
      setDesignerData(formattedData);
    } catch (err) {
      const handledError = handleApiError(err);
      setError(handledError);
      console.error("Error fetching designer data:", handledError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (designerData.length === 0) {
      fetchDesignerData();
    }
  }, [designerData.length, fetchDesignerData]);

  return {
    designerData,
    loading,
    error,
    refreshData: fetchDesignerData,
  } as const;
};

/**
 * Type guard to check if an error is an ApiError
 */
export const isApiError = (error: unknown): error is ApiError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as ApiError).message === "string"
  );
};
