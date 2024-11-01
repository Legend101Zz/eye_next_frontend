import { IBaseRepository } from "./IBaseRepository";
import { Design } from "@/domain/entities/design.entity";

/**
 * Design Query Parameters
 * Used for filtering designs
 */
export interface DesignQueryParams {
  /** Filter by verification status */
  isVerified?: boolean;
}

/**
 * Design Repository Interface
 * Handles all design-related data operations
 *
 * @extends {IBaseRepository<Design>}
 */
export interface IDesignRepository {
  /**
   * Show all designs
   * Returns complete list of designs with designer information
   *
   * @returns Promise resolving to array of designs
   * @throws {DatabaseError} If query fails
   *
   * @example
   * ```typescript
   * const designs = await designRepo.showDesigns();
   * console.log(designs[0].title);
   * ```
   */
  showDesigns(): Promise<Design[]>;

  /**
   * Get random designs
   * Returns up to 5 random verified designs
   *
   * @returns Promise resolving to array of designs
   * @throws {DatabaseError} If query fails
   *
   * @example
   * ```typescript
   * const randomDesigns = await designRepo.getRandomDesigns();
   * ```
   */
  getRandomDesigns(): Promise<Design[]>;

  /**
   * Get designs by designer
   * Returns all designs for a specific designer
   *
   * @param designerId - ID of the designer
   * @returns Promise resolving to array of designs
   * @throws {NotFoundError} If designer doesn't exist
   *
   * @example
   * ```typescript
   * const designs = await designRepo.getDesignerDesigns("designer123");
   * ```
   */
  getDesignerDesigns(designerId: string): Promise<Design[]>;

  /**
   * Update design
   * Updates design title, description, or product associations
   *
   * @param designId - ID of design to update
   * @param data - Updated design data
   * @returns Promise resolving to updated design
   * @throws {NotFoundError} If design doesn't exist
   *
   * @example
   * ```typescript
   * const updated = await designRepo.updateDesign("design123", {
   *   title: "New Title",
   *   description: "New description"
   * });
   * ```
   */
  updateDesign(
    designId: string,
    data: {
      title?: string;
      description?: string;
      productIds?: string[];
    },
  ): Promise<Design>;
}
