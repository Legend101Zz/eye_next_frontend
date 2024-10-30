import { z } from "zod";
import { BaseSchema } from "./base.schema";
import { AddressSchema } from "./userSchema";

export const OrderItemSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  designId: z.string().uuid().optional(),
  quantity: z.number().min(1),
  price: z.number().positive(),
  color: z.string(),
  size: z.string(),
  designerEarnings: z.number().min(0),
  status: z.enum([
    "pending",
    "processing",
    "printed",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
});

export const PaymentDetailsSchema = z.object({
  method: z.enum([
    "credit_card",
    "debit_card",
    "paypal",
    "stripe",
    "bank_transfer",
  ]),
  status: z.enum(["pending", "completed", "failed", "refunded"]),
  transactionId: z.string().optional(),
  paidAt: z.date().optional(),
});

export const TrackingUpdateSchema = z.object({
  status: z.string(),
  location: z.string(),
  timestamp: z.date(),
  description: z.string(),
});

export const TrackingInfoSchema = z.object({
  carrier: z.string(),
  trackingNumber: z.string(),
  estimatedDelivery: z.date(),
  updates: z.array(TrackingUpdateSchema),
});

export const OrderSchema = BaseSchema.extend({
  userId: z.string().uuid(),
  items: z.array(OrderItemSchema),
  status: z.enum([
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ]),
  shippingAddress: AddressSchema,
  billingAddress: AddressSchema,
  payment: PaymentDetailsSchema,
  subtotal: z.number().positive(),
  tax: z.number().min(0),
  shippingCost: z.number().min(0),
  total: z.number().positive(),
  tracking: TrackingInfoSchema.optional(),
});
