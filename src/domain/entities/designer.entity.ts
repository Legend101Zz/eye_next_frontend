/**
 * Represents an image in the system
 * Used for profile images, cover images, and documents
 */
export interface Image {
  id: string;
  url: string;
  filename: string;
}

/**
 * Designer visibility and display settings
 * Controls what information is visible on the designer's public profile
 */
export interface DesignerSettings {
  isPrivate: boolean;
  showDesigns: {
    enabled: boolean;
    designIds: string[]; // References to Design entities
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

/**
 * Represents a Designer entity in the system
 * Contains all designer-specific information and relationships
 */
export interface Designer {
  id: string;
  userId: string; // Reference to User ID of the designer ... as person first becomes a user and then a designer
  followers: string[]; // Array of User IDs
  profileImage?: Image;
  coverImage?: Image;
  isApproved: boolean;
  designs: string[]; // Array of Design IDs

  // Personal Information
  legalFirstName: string;
  legalLastName: string;
  fullName: string;
  artistName: string;
  description?: string;

  // Contact and Social
  socialMedia: string[];
  phone?: number;
  portfolioLinks: string[];
  cvLinks: string[];

  // Legal Information
  legalAddresses: string[]; // Array of Address IDs
  panCard?: Image;
  panCardNumber?: string;

  // Settings
  settings: DesignerSettings;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}
