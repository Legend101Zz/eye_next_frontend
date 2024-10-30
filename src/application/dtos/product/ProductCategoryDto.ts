/**
 * Product Category Data Transfer Objects (DTOs)
 * Handle product category data transformations
 *
 * @module product/dtos
 */

/**
 * Category response DTO
 */
export interface ProductCategoryDto {
  /** Category ID */
  id: string;
  /** Category name */
  name: string;
  /** Category slug */
  slug: string;
  /** Category description */
  description?: string;
  /** Parent category ID */
  parentId?: string;
  /** Category level */
  level: number;
  /** Category path */
  path: string[];
  /** Category image */
  image?: {
    /** Image URL */
    url: string;
    /** Alt text */
    alt: string;
  };
  /** Category metadata */
  metadata: {
    /** Product count */
    productCount: number;
    /** Active product count */
    activeProductCount: number;
    /** Creation date */
    createdAt: number;
    /** Last update date */
    updatedAt: number;
  };
  /** SEO information */
  seo: {
    /** Title */
    title: string;
    /** Description */
    description: string;
    /** Keywords */
    keywords: string[];
  };
  /** Display settings */
  display: {
    /** Show in menu */
    showInMenu: boolean;
    /** Show in filters */
    showInFilters: boolean;
    /** Menu order */
    menuOrder: number;
    /** Featured category */
    featured: boolean;
  };
  /** Category attributes */
  attributes: Array<{
    /** Attribute name */
    name: string;
    /** Attribute type */
    type: "text" | "number" | "boolean" | "select";
    /** Required flag */
    required: boolean;
    /** Filterable flag */
    filterable: boolean;
    /** Default value */
    default?: any;
    /** Possible values for select type */
    values?: string[];
  }>;
}

/**
 * Create category request DTO
 */
export interface CreateCategoryRequestDto {
  /** Category name */
  name: string;
  /** Category description */
  description?: string;
  /** Parent category ID */
  parentId?: string;
}
