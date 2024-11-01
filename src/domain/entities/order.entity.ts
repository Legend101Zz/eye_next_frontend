// Note this has to be implemented in backend first

import { Address } from "./user.entity";
import { CartItem } from "./user.entity";

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  payment: PaymentDetails;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  tracking?: TrackingInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem extends CartItem {
  designerEarnings: number;
  status: OrderItemStatus;
}

export interface PaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
}

export interface TrackingInfo {
  carrier: string;
  trackingNumber: string;
  estimatedDelivery: Date;
  updates: TrackingUpdate[];
}

export interface TrackingUpdate {
  status: string;
  location: string;
  timestamp: Date;
  description: string;
}

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderItemStatus =
  | "pending"
  | "processing"
  | "printed"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type PaymentMethod =
  | "credit_card"
  | "debit_card"
  | "paypal"
  | "stripe"
  | "bank_transfer";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
