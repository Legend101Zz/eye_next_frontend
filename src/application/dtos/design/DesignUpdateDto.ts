import { DesignCreateDto } from "./DesignCreateDto";

/**
 * Data Transfer Object for updating an existing design
 * Partial update support for design properties
 *
 * @example
 * ```typescript
 * const updateDto: DesignUpdateDto = {
 *   title: "Updated Design Title",
 *   tags: ["new-tag", "trendy"],
 *   isActive: true
 * };
 * ```
 */
export interface DesignUpdateDto {
  /** Updated design title */
  title?: string;

  /** Updated description */
  description?: string;

  /** New design file (if updating) */
  designFile?: File;

  /** Updated category */
  category?: string;

  /** Updated color palette */
  colors?: string[];

  /** Updated tags */
  tags?: string[];

  /** Design status */
  isActive?: boolean;

  /** Updated render preferences */
  renderPreferences?: Partial<DesignCreateDto["renderPreferences"]>;

  /** Updated pricing information */
  pricing?: Partial<DesignCreateDto["pricing"]>;

  /** Version information */
  version?: {
    /** Version number */
    number: string;
    /** Change notes */
    notes: string;
    /** Update type */
    updateType: "minor" | "major";
  };
}
