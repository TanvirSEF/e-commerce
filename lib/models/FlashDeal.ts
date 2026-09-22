import mongoose, { Schema, Model, Document } from "mongoose"

export interface IFlashDealProduct {
  product: mongoose.Types.ObjectId
  discount: number
  discount_type: "flat" | "percent"
}

export interface IFlashDeal extends Document {
  title: string
  slug: string
  start_date: number
  end_date: number
  status: boolean
  featured: boolean
  background_color?: string
  text_color?: string
  banner?: string
  products: IFlashDealProduct[]
  createdAt: Date
  updatedAt: Date
}

const FlashDealProductSchema = new Schema<IFlashDealProduct>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    discount: { type: Number, default: 0 },
    discount_type: { type: String, enum: ["flat", "percent"], default: "percent" },
  },
  { _id: false }
)

const FlashDealSchema = new Schema<IFlashDeal>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    start_date: { type: Number, required: true },
    end_date: { type: Number, required: true },
    status: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    background_color: { type: String, default: "#ffffff" },
    text_color: { type: String, default: "#000000" },
    banner: { type: String, default: "" },
    products: [FlashDealProductSchema],
  },
  { timestamps: true }
)

export const FlashDeal: Model<IFlashDeal> =
  mongoose.models.FlashDeal || mongoose.model<IFlashDeal>("FlashDeal", FlashDealSchema)

export default FlashDeal
