import mongoose, { Schema, Model, Document } from "mongoose"

export interface ICategory extends Document {
  name: string
  slug: string
  parent_id?: mongoose.Types.ObjectId | null
  order_level: number
  featured: boolean
  hot_category: boolean
  banner?: string
  icon?: string
  digital: boolean
  commission_rate: number
  createdAt: Date
  updatedAt: Date
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    parent_id: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    order_level: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    hot_category: { type: Boolean, default: false },
    banner: { type: String, default: "" },
    icon: { type: String, default: "" },
    digital: { type: Boolean, default: false },
    commission_rate: { type: Number, default: 0 },
  },
  { timestamps: true }
)

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema)

export default Category
