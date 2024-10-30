/**
 * Data Transfer Object for designer profile creation and updates
 * Used when users request designer status or update their profile
 *
 * @example
 * ```typescript
 * const profileDto: DesignerProfileDto = {
 *   legalName: "John Smith",
 *   artistName: "DesignMaster",
 *   bio: "Digital artist specializing in modern designs",
 *   specializations: ["digital-art", "typography"]
 * };
 * ```
 */
export interface DesignerProfileDto {
  /** Legal first name */
  legalFirstName: string;

  /** Legal last name */
  legalLastName: string;

  /** Artist/Brand name */
  artistName: string;

  /** Professional biography */
  bio?: string;

  /** Profile images */
  images?: {
    /** Profile photo file */
    profilePhoto?: File;
    /** Cover photo file */
    coverPhoto?: File;
  };

  /** Contact information */
  contact: {
    /** Business email */
    email: string;
    /** Phone number */
    phone?: string;
    /** Business address */
    address?: {
      addressLine1: string;
      addressLine2?: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };

  /** Professional details */
  professional: {
    /** Areas of expertise */
    specializations: string[];
    /** Years of experience */
    experience: number;
    /** Design software proficiency */
    tools: string[];
    /** Portfolio URL */
    portfolioUrl?: string;
    /** Social media links */
    socialLinks?: {
      instagram?: string;
      twitter?: string;
      behance?: string;
      dribbble?: string;
      website?: string;
    };
  };

  /** Legal documents */
  legal?: {
    /** Tax ID/PAN number */
    taxId?: string;
    /** Business registration number */
    businessId?: string;
    /** Tax documents */
    taxDocuments?: File[];
    /** Identity proof */
    identityProof?: File;
  };

  /** Payment details */
  payment?: {
    /** Preferred payout method */
    payoutMethod: "bank" | "paypal" | "stripe";
    /** Payment details based on method */
    details: Record<string, any>;
  };
}
