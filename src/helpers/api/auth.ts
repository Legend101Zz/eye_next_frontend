import { DesignerSignupFormValues } from "@/components/auth/DesignerSignupForm";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

type DesignerSignupValues = DesignerSignupFormValues & {
  userId: string;
};

interface AddressBody {
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: string;
}

const validateFiles = (profilePhoto: File | null, coverPhoto: File | null) => {
  const errors = [];
  const maxProfileSize = 4 * 1024 * 1024; // 4MB
  const maxCoverSize = 2 * 1024 * 1024; // 2MB
  const validTypes = ["image/jpeg", "image/png"];

  if (!profilePhoto || !coverPhoto) {
    errors.push("Both profile and cover photos are required");
    return errors;
  }

  if (profilePhoto.size > maxProfileSize) {
    errors.push("Profile photo must be smaller than 4MB");
  }

  if (coverPhoto.size > maxCoverSize) {
    errors.push("Cover photo must be smaller than 2MB");
  }

  if (!validTypes.includes(profilePhoto.type)) {
    errors.push("Profile photo must be JPEG or PNG");
  }

  if (!validTypes.includes(coverPhoto.type)) {
    errors.push("Cover photo must be JPEG or PNG");
  }

  return errors;
};

const validateRequiredFields = (
  userId: string,
  clientName: string,
  artistName: string,
  clientDescription: string
) => {
  if (!userId || !clientName || !artistName || !clientDescription) {
    throw new Error("Required fields are missing");
  }
};
export const handleDesignerSignup = async ({
  userId,
  clientName,
  artistName,
  clientDescription,
  phone,
  addressLine1,
  addressLine2,
  city,
  postalCode,
  addressType,
  state,
  panCardNumber,
  portfolioLinks,
  cvLinks,
  country,
  coverPhoto,
  profilePhoto,
}: DesignerSignupValues) => {
  try {
    // Validate required fields
    validateRequiredFields(userId, clientName, artistName, clientDescription);

    // Validate files
    const fileErrors = validateFiles(profilePhoto, coverPhoto);
    if (fileErrors.length > 0) {
      throw new Error(fileErrors.join(", "));
    }

    // Create the request payload
    const payload = {
      userId: userId.trim(),
      fullname: clientName.trim(),
      artistName: artistName.trim(),
      description: clientDescription.trim(),
      phone: phone?.trim(),
      panCardNumber: panCardNumber?.trim(),
      portfolioLinks: portfolioLinks?.trim(),
      cvLinks: cvLinks?.trim(),
      addressBody: {
        address_line1: addressLine1.trim(),
        address_line2: addressLine2?.trim() || "",
        city: city.trim(),
        state: state.trim(),
        postal_code: postalCode?.toString().trim() || "",
        country: country.trim(),
        address_type: addressType.toLowerCase().trim() || "home",
      },
    };

    // Create FormData and append all fields
    const formData = new FormData();

    // Append non-file fields
    Object.entries(payload).forEach(([key, value]) => {
      if (key === "addressBody") {
        // For addressBody, append each field individually with the proper structure
        Object.entries(value).forEach(([addressKey, addressValue]) => {
          formData.append(`addressBody[${addressKey}]`, addressValue as string);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    // Append files last
    if (profilePhoto instanceof File) {
      formData.append("image", profilePhoto);
    }
    if (coverPhoto instanceof File) {
      formData.append("image", coverPhoto);
    }

    // Make API request
    const maxRetries = 3;
    let retries = 0;

    while (retries < maxRetries) {
      try {
        const response = await axios({
          method: "post",
          url: `${API_URL}/api/designer/request`,
          headers: {
            "x-api-key": "token",
            "Content-Type": "multipart/form-data",
          },
          data: formData,
          timeout: 30000,
          validateStatus: (status) => status === 201,
        });
        return response.data;
      } catch (error) {
        retries++;
        if (retries === maxRetries) throw error;
        await new Promise((resolve) =>
          setTimeout(resolve, Math.pow(2, retries) * 1000)
        );
      }
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 413) {
        throw new Error("Files are too large. Please reduce their size.");
      }
      if (error.response?.status === 415) {
        throw new Error(
          "Invalid file format. Please use JPEG or PNG files only."
        );
      }
      throw new Error(
        error.response?.data?.message ||
          "Failed to create designer account. Please try again."
      );
    }
    throw error instanceof Error
      ? error
      : new Error("An unexpected error occurred");
  }
};
