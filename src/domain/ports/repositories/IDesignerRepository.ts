import { Designer, DesignerSettings } from "@/domain/entities/designer.entity";

/**
 * Designer Repository Interface
 * Handles all designer-related operations including profile management,
 * file uploads, and settings
 */
export interface IDesignerRepository {
  /**
   * Request designer status for a user
   * Creates a new designer profile with initial data
   *
   * @param userId - User ID requesting designer status
   * @param data - Designer profile data
   * @param files - Profile and cover photos
   * @returns Promise resolving to created designer
   * @throws {ValidationError} If data is invalid
   *
   * @example
   * ```typescript
   * const designer = await designerRepo.requestDesigner(
   *   "user123",
   *   { fullname: "John Doe", artistName: "JD Arts" },
   *   [profilePhoto, coverPhoto]
   * );
   * ```
   */
  requestDesigner(
    userId: string,
    data: {
      fullname: string;
      artistName: string;
      description?: string;
      portfolioLinks?: string[];
      cvLinks?: string[];
      phone?: string;
      panCardNumber?: string;
      addressBody: any;
    },
    files: File[],
  ): Promise<Designer>;

  /**
   * Update designer profile
   * Modifies designer profile information
   *
   * @param designerId - Designer ID
   * @param updates - Profile updates
   * @returns Promise resolving to updated designer
   * @throws {NotFoundError} If designer doesn't exist
   */
  updateDesignerProfile(
    designerId: string,
    updates: {
      legal_first_name?: string;
      legal_last_name?: string;
      description?: string;
      legal_address?: string[];
      socialMedia?: string[];
      portfolioLinks?: string[];
    },
  ): Promise<Designer>;

  /**
   * Add/update profile photo
   *
   * @param designerId - Designer ID
   * @param file - Profile photo file
   * @returns Promise resolving to updated designer
   */
  addProfilePhoto(designerId: string, file: File): Promise<Designer>;

  /**
   * Add PAN card document
   *
   * @param designerId - Designer ID
   * @param file - PAN card document file
   * @returns Promise resolving to updated designer
   */
  addPanCard(designerId: string, file: File): Promise<Designer>;

  /**
   * Get designer's public profile
   *
   * @param designerId - Designer ID
   * @returns Promise resolving to public profile data
   * @throws {NotFoundError} If designer doesn't exist
   */
  getPublicProfile(designerId: string): Promise<any>;

  /**
   * Get designer's personal profile
   *
   * @param designerId - Designer ID
   * @returns Promise resolving to personal profile data
   * @throws {NotFoundError} If designer doesn't exist
   */
  getPersonalProfile(designerId: string): Promise<any>;

  /**
   * Get designs by designer
   *
   * @param designerId - Designer ID
   * @returns Promise resolving to designer's designs
   */
  getDesigns(designerId: string): Promise<
    Array<{
      title: string;
      description: string;
      designImages: Array<{ url: string }>;
    }>
  >;

  /**
   * Get random designers
   * Returns random approved designers with their designs
   *
   * @returns Promise resolving to random designers
   */
  getRandomDesigners(): Promise<
    Array<{
      profileImage: string | null;
      designImage: string | null;
      totalDesigns: number;
      designerFollowers: number;
      designName: string;
      designerId: string;
      designerName: string;
    }>
  >;

  /**
   * Create new design
   *
   * @param designerId - Designer ID
   * @param data - Design data
   * @param file - Design image file
   * @returns Promise resolving to created design
   */
  createDesign(
    designerId: string,
    data: {
      title?: string;
      description?: string;
      productId?: string;
    },
    file: File,
  ): Promise<any>;

  /**
   * Get designer settings
   *
   * @param designerId - Designer ID
   * @returns Promise resolving to designer settings
   */
  getSettings(designerId: string): Promise<DesignerSettings>;

  /**
   * Update designer settings
   *
   * @param designerId - Designer ID
   * @param settings - Updated settings
   * @returns Promise resolving to updated designer
   */
  updateSettings(
    designerId: string,
    settings: Partial<DesignerSettings>,
  ): Promise<Designer>;
}
