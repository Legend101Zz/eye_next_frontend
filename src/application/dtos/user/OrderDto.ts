/**
 * Order Data Transfer Objects (DTOs)
 * These DTOs handle order-related data transformations between
 * the presentation and domain layers.
 *
 * @module user/dtos
 */

/**
 * Order status enumeration
 */
export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
  REFUNDED = "refunded",
}

/**
 * Payment status enumeration
 */
export enum PaymentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  FAILED = "failed",
  REFUNDED = "refunded",
}

/**
 * Order response DTO
 * Represents a complete order
 *
 * @example
 * ```typescript
 * const order: OrderDto = {
 *   id: "order123",
 *   status: OrderStatus.CONFIRMED,
 *   items: [{
 *     productId: "prod123",
 *     quantity: 2,
 *     price: 29.99
 *   }]
 * };
 * ```
 */
export interface OrderDto {
  /** Order unique identifier */
  id: string;
  /** Order status */
  status: OrderStatus;
  /** Order items */
  items: Array<{
    /** Product ID */
    productId: string;
    /** Product name */
    name: string;
    /** Design ID if applicable */
    designId?: string;
    /** Designer ID if applicable */
    designerId?: string;
    /** Quantity ordered */
    quantity: number;
    /** Price per unit */
    price: number;
    /** Total for item */
    total: number;
    /** Selected options (size, color, etc.) */
    options?: Record<string, string>;
  }>;
  /** Order totals */
  totals: {
    /** Subtotal before tax/shipping */
    subtotal: number;
    /** Tax amount */
    tax: number;
    /** Shipping cost */
    shipping: number;
    /** Discount amount */
    discount: number;
    /** Final total */
    total: number;
  };
  /** Payment information */
  payment: {
    /** Payment status */
    status: PaymentStatus;
    /** Payment method used */
    method: string;
    /** Transaction ID */
    transactionId?: string;
    /** Payment timestamp */
    paidAt?: number;
  };
  /** Shipping information */
  shipping: {
    /** Shipping address */
    address: AddressDto;
    /** Carrier (UPS, FedEx, etc.) */
    carrier?: string;
    /** Tracking number */
    trackingNumber?: string;
    /** Estimated delivery date */
    estimatedDelivery?: number;
    /** Actual delivery date */
    deliveredAt?: number;
  };
  /** Order dates */
  dates: {
    /** Order creation date */
    createdAt: number;
    /** Last update date */
    updatedAt: number;
    /** Processing start date */
    processedAt?: number;
    /** Shipping date */
    shippedAt?: number;
  };
}

/**
 * Create order request DTO
 * Used when placing a new order
 */
export interface CreateOrderRequestDto {
  /** Items to order */
  items: Array<{
    /** Product ID */
    productId: string;
    /** Quantity to order */
    quantity: number;
    /** Selected options */
    options?: Record<string, string>;
  }>;
  /** Shipping address ID */
  shippingAddressId: string;
  /** Billing address ID */
  billingAddressId: string;
  /** Payment method ID */
  paymentMethodId: string;
  /** Coupon code if any */
  couponCode?: string;
}

/**
 * Order update request DTO
 * Used when updating order status
 */
export interface UpdateOrderRequestDto {
  /** New order status */
  status: OrderStatus;
  /** Update reason */
  reason?: string;
  /** Additional notes */
  notes?: string;
}

/**
 * Order cancellation request DTO
 * Used when cancelling an order
 */
export interface CancelOrderRequestDto {
  /** Cancellation reason */
  reason: string;
  /** Whether to refund payment */
  refund: boolean;
  /** Additional notes */
  notes?: string;
}
