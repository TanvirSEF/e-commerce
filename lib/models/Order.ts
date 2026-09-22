import mongoose, { Schema, Model, Document } from "mongoose"

export interface IOrderItem {
  product: mongoose.Types.ObjectId
  variation?: string
  price: number
  tax: number
  shipping_cost: number
  quantity: number
  delivery_status: "pending" | "confirmed" | "picked_up" | "on_the_way" | "delivered" | "cancelled"
  payment_status: "paid" | "unpaid"
}

export interface IOrder extends Document {
  combined_order_code: string
  code: string
  user?: mongoose.Types.ObjectId
  guest_id?: string
  shipping_address: {
    name: string
    email?: string
    address: string
    country: string
    city: string
    postal_code?: string
    phone: string
  }
  payment_type: "cash_on_delivery" | "uddoktapay" | "bkash" | "nagad" | "stripe" | "sslcommerz" | "wallet"
  payment_status: "paid" | "unpaid"
  payment_details?: string
  grand_total: number
  coupon_discount: number
  items: IOrderItem[]
  tracking_code: string
  delivery_status: "pending" | "confirmed" | "picked_up" | "on_the_way" | "delivered" | "cancelled"
  date: number
  viewed: boolean
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variation: { type: String, default: "" },
    price: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shipping_cost: { type: Number, default: 0 },
    quantity: { type: Number, required: true, default: 1 },
    delivery_status: {
      type: String,
      enum: ["pending", "confirmed", "picked_up", "on_the_way", "delivered", "cancelled"],
      default: "pending",
    },
    payment_status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
  },
  { _id: true }
)

const OrderSchema = new Schema<IOrder>(
  {
    combined_order_code: { type: String, default: "" },
    code: { type: String, required: true, unique: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    guest_id: { type: String, default: "" },
    shipping_address: {
      name: { type: String, required: true },
      email: { type: String, default: "" },
      address: { type: String, required: true },
      country: { type: String, default: "Bangladesh" },
      city: { type: String, required: true },
      postal_code: { type: String, default: "" },
      phone: { type: String, required: true },
    },
    payment_type: {
      type: String,
      enum: ["cash_on_delivery", "uddoktapay", "bkash", "nagad", "stripe", "sslcommerz", "wallet"],
      default: "cash_on_delivery",
    },
    payment_status: { type: String, enum: ["paid", "unpaid"], default: "unpaid" },
    payment_details: { type: String, default: "" },
    grand_total: { type: Number, required: true },
    coupon_discount: { type: Number, default: 0 },
    items: [OrderItemSchema],
    tracking_code: { type: String, default: "", index: true },
    delivery_status: {
      type: String,
      enum: ["pending", "confirmed", "picked_up", "on_the_way", "delivered", "cancelled"],
      default: "pending",
    },
    date: { type: Number, default: () => Math.floor(Date.now() / 1000) },
    viewed: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema)

export default Order
