import mongoose, { Schema, Model, Document } from "mongoose"

export interface IVariation {
  variant: string
  sku: string
  price: number
  stock: number
  img?: string
}

export interface IChoiceOption {
  attribute_id: string
  values: string[]
}

export interface IProduct extends Document {
  name: string
  slug: string
  sku: string
  category: mongoose.Types.ObjectId
  brand?: mongoose.Types.ObjectId
  photos: string[]
  thumbnail_img: string
  unit_price: number
  purchase_price?: number
  discount: number
  discount_type: "flat" | "percent"
  current_stock: number
  unit: string
  rating: number
  num_of_reviews: number
  num_of_sale: number
  description: string
  colors: string[]
  choice_options: IChoiceOption[]
  variations: IVariation[]
  featured: boolean
  todays_deal: boolean
  published: boolean
  createdAt: Date
  updatedAt: Date
}

const VariationSchema = new Schema<IVariation>(
  {
    variant: { type: String, required: true },
    sku: { type: String, default: "" },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    img: { type: String, default: "" },
  },
  { _id: false }
)

const ChoiceOptionSchema = new Schema<IChoiceOption>(
  {
    attribute_id: { type: String, required: true },
    values: [{ type: String }],
  },
  { _id: false }
)

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, default: "", index: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    brand: { type: Schema.Types.ObjectId, ref: "Brand", default: null },
    photos: [{ type: String }],
    thumbnail_img: { type: String, default: "" },
    unit_price: { type: Number, required: true },
    purchase_price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    discount_type: { type: String, enum: ["flat", "percent"], default: "percent" },
    current_stock: { type: Number, default: 0 },
    unit: { type: String, default: "pc" },
    rating: { type: Number, default: 0 },
    num_of_reviews: { type: Number, default: 0 },
    num_of_sale: { type: Number, default: 0 },
    description: { type: String, default: "" },
    colors: [{ type: String }],
    choice_options: [ChoiceOptionSchema],
    variations: [VariationSchema],
    featured: { type: Boolean, default: false },
    todays_deal: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema)

export default Product
