import mongoose, { Schema, Model, Document } from "mongoose"

export interface ICartItem {
  product: mongoose.Types.ObjectId
  variation?: string
  price: number
  tax: number
  shipping_cost: number
  quantity: number
}

export interface ICart extends Document {
  user?: mongoose.Types.ObjectId | null
  temp_user_id?: string
  items: ICartItem[]
  coupon_code?: string
  discount: number
  createdAt: Date
  updatedAt: Date
}

const CartItemSchema = new Schema<ICartItem>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    variation: { type: String, default: "" },
    price: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    shipping_cost: { type: Number, default: 0 },
    quantity: { type: Number, required: true, default: 1, min: 1 },
  },
  { _id: true }
)

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
    temp_user_id: { type: String, index: true, sparse: true },
    items: [CartItemSchema],
    coupon_code: { type: String, default: "" },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema)

export default Cart
