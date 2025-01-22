import { useState, useEffect } from "react";
import {
  getDesignerSettings,
  getDesignerPersonalData,
  getDesignerDesigns,
  getDesignDetails,
} from "@/helpers/api/designerApi";

interface DesignerSettings {
  isPrivate: boolean;
  showDesigns: {
    enabled: boolean;
    designIds: string[];
  };
  showFollowers: boolean;
  showFullName: boolean;
  showPhone: boolean;
  showDescription: boolean;
  showCoverPhoto: boolean;
  showProfilePhoto: boolean;
  socialMedia: string[];
  portfolioLinks: string[];
}

interface DesignerData {
  profileImage?: { url: string };
  coverImage?: { url: string };
  legal_first_name?: string;
  legal_last_name?: string;
  fullname: string;
  artistName: string;
  description?: string;
  phone?: string;
  followers?: number;
}

export const usePublicProfile = (designerId: string) => {
  const [settings, setSettings] = useState<DesignerSettings | null>(null);
  const [designerData, setDesignerData] = useState<DesignerData | null>(null);
  const [designs, setDesigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch settings first to check privacy
        const settingsData = await getDesignerSettings(designerId);
        setSettings(settingsData.settings);
        if (settingsData.settings.isPrivate) {
          setDesignerData(null);
          setDesigns([]);
          return;
        }

        // Fetch designer data
        const profileData = await getDesignerPersonalData(designerId);
        setDesignerData(profileData);

        // Fetch designs based on settings
        if (settingsData.settings.showDesigns.enabled) {
          if (settingsData.settings.showDesigns.designIds.length > 0) {
            // Fetch specific designs
            const designPromises =
              settingsData.settings.showDesigns.designIds.map((id: string) =>
                getDesignDetails(id)
              );
            const designsData = await Promise.all(designPromises);
            setDesigns(designsData);
          } else {
            // Fetch all designs
            const allDesignsData = await getDesignerDesigns(designerId);
            setDesigns(allDesignsData.designs || []);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [designerId]);

  // Filter data based on settings
  const filteredData =
    settings && designerData
      ? {
          name: settings.showFullName
            ? designerData.fullname
            : designerData.artistName,
          description: settings.showDescription
            ? designerData.description
            : null,
          phone: settings.showPhone ? designerData.phone : null,
          profileImage: settings.showProfilePhoto
            ? designerData.profileImage?.url
            : null,
          coverImage: settings.showCoverPhoto
            ? designerData.coverImage?.url
            : null,
          followers: settings.showFollowers ? designerData.followers : null,
          socialMedia: settings.socialMedia || [],
          portfolioLinks: settings.portfolioLinks || [],
        }
      : null;
  console.log("filteredData", settings, designs);
  return {
    isPrivate: settings?.isPrivate || false,
    data: filteredData,
    designs: settings?.showDesigns.enabled ? designs : [],
    loading,
    error,
    settings,
  };
};
