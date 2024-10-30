import { IBaseRepository } from "./IBaseRepository";
import {
  Designer,
  Image,
  DesignerSettings,
} from "@/domain/entities/designer.entity";

/**
 * Repository interface for Designer entity operations
 * Extends the base repository with designer-specific operations
 */
export interface IDesignerRepository extends IBaseRepository<Designer> {
  /**
   * Find a designer by their associated user ID
   *
   * @param userId - The ID of the associated user
   * @returns Promise resolving to Designer or null if not found
   * @throws {DatabaseError} If the query fails
   */
  findByUserId(userId: string): Promise<Designer | null>;

  /**
   * Update a designer's settings
   *
   * @param designerId - The ID of the designer
   * @param settings - The new settings to apply
   * @returns Promise resolving to the updated Designer
   * @throws {NotFoundError} If the designer doesn't exist
   * @throws {ValidationError} If the settings are invalid
   */
  updateSettings(
    designerId: string,
    settings: Partial<DesignerSettings>,
  ): Promise<Designer>;

  /**
   * Add a follower to a designer's followers list
   *
   * @param designerId - The ID of the designer
   * @param followerId - The ID of the user following the designer
   * @returns Promise resolving to the updated Designer
   * @throws {NotFoundError} If either entity doesn't exist
   * @throws {ValidationError} If the user is already following
   */
  addFollower(designerId: string, followerId: string): Promise<Designer>;

  /**
   * Remove a follower from a designer's followers list
   *
   * @param designerId - The ID of the designer
   * @param followerId - The ID of the user to remove
   * @returns Promise resolving to the updated Designer
   * @throws {NotFoundError} If either entity doesn't exist
   */
  removeFollower(designerId: string, followerId: string): Promise<Designer>;

  /**
   * Update a designer's approval status
   *
   * @param designerId - The ID of the designer
   * @param isApproved - The new approval status
   * @returns Promise resolving to the updated Designer
   * @throws {NotFoundError} If the designer doesn't exist
   */
  updateApprovalStatus(
    designerId: string,
    isApproved: boolean,
  ): Promise<Designer>;

  /**
   * Add a design to a designer's portfolio
   *
   * @param designerId - The ID of the designer
   * @param designId - The ID of the design to add
   * @returns Promise resolving to the updated Designer
   * @throws {NotFoundError} If either entity doesn't exist
   */
  addDesign(designerId: string, designId: string): Promise<Designer>;

  /**
   * Remove a design from a designer's portfolio
   *
   * @param designerId - The ID of the designer
   * @param designId - The ID of the design to remove
   * @returns Promise resolving to the updated Designer
   * @throws {NotFoundError} If either entity doesn't exist
   */
  removeDesign(designerId: string, designId: string): Promise<Designer>;

  /**
   * Update a designer's profile or cover image
   *
   * @param designerId - The ID of the designer
   * @param imageType - Type of image to update ('profile' or 'cover')
   * @param image - The new image data
   * @returns Promise resolving to the updated Designer
   * @throws {NotFoundError} If the designer doesn't exist
   * @throws {ValidationError} If the image data is invalid
   */
  updateImage(
    designerId: string,
    imageType: "profile" | "cover",
    image: Omit<Image, "id">,
  ): Promise<Designer>;

  /**
   * Find designers by approval status
   *
   * @param isApproved - The approval status to filter by
   * @returns Promise resolving to array of matching Designers
   */
  findByApprovalStatus(isApproved: boolean): Promise<Designer[]>;

  /**
   * Get the total number of followers for a designer
   *
   * @param designerId - The ID of the designer
   * @returns Promise resolving to the follower count
   * @throws {NotFoundError} If the designer doesn't exist
   */
  getFollowerCount(designerId: string): Promise<number>;
}
