/**
 * Address Data Transfer Objects (DTOs)
 * These DTOs handle user address data transformations between
 * the presentation and domain layers.
 *
 * @module user/dtos
 */

/**
 * Address types enumeration
 */
export enum AddressType {
  HOME = "home",
  WORK = "work",
  BILLING = "billing",
  SHIPPING = "shipping",
  OTHER = "other",
}

/**
 * Address response DTO
 * Represents a user's address information
 *
 * @example
 * ```typescript
 * const address: AddressDto = {
 *   id: "addr123",
 *   type: AddressType.HOME,
 *   street: "123 Design St",
 *   city: "Artville"
 * };
 * ```
 */
export interface AddressDto {
  /** Address unique identifier */
  id: string;
  /** Address type */
  type: AddressType;
  /** Street address line 1 */
  street: string;
  /** Street address line 2 */
  street2?: string;
  /** City name */
  city: string;
  /** State or province */
  state: string;
  /** ZIP or postal code */
  postalCode: string;
  /** Country code (ISO) */
  country: string;
  /** Whether this is default address */
  isDefault: boolean;
  /** Address label (e.g., "Home", "Office") */
  label?: string;
  /** Additional delivery instructions */
  instructions?: string;
  /** Contact phone for this address */
  phone?: string;
  /** Whether address is verified */
  isVerified: boolean;
}

/**
 * Create address request DTO
 * Used when adding a new address
 *
 * @example
 * ```typescript
 * const newAddress: CreateAddressRequestDto = {
 *   type: AddressType.HOME,
 *   street: "123 Design St",
 *   city: "Artville"
 * };
 * ```
 */
export interface CreateAddressRequestDto {
  /** Address type */
  type: AddressType;
  /** Street address line 1 */
  street: string;
  /** Street address line 2 */
  street2?: string;
  /** City name */
  city: string;
  /** State or province */
  state: string;
  /** ZIP or postal code */
  postalCode: string;
  /** Country code */
  country: string;
  /** Whether to set as default */
  setAsDefault?: boolean;
  /** Address label */
  label?: string;
  /** Delivery instructions */
  instructions?: string;
  /** Contact phone */
  phone?: string;
}

/**
 * Update address request DTO
 * Used when updating an existing address
 */
export interface UpdateAddressRequestDto
  extends Partial<CreateAddressRequestDto> {
  /** Whether to set as default */
  setAsDefault?: boolean;
}

/**
 * Address validation response DTO
 * Returned after address validation
 */
export interface AddressValidationDto {
  /** Whether address is valid */
  isValid: boolean;
  /** Suggested corrections if any */
  suggestions?: AddressDto[];
  /** Validation issues if any */
  issues?: {
    /** Field with issue */
    field: string;
    /** Issue description */
    message: string;
    /** Suggested correction */
    suggestion?: string;
  }[];
}
