import mongoose, { Schema, Model, Document } from "mongoose"

export interface IBrand extends Document {
  name: string
  slug: string
  logo?: string
  meta_title?: string
  meta_description?: string
  top: boolean
  createdAt: Date
  updatedAt: Date
}

const BrandSchema = new Schema<IBrand>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    logo: { type: String, default: "" },
    meta_title: { type: String, default: "" },
    meta_description: { type: String, default: "" },
    top: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const Brand: Model<IBrand> =
  mongoose.models.Brand || mongoose.model<IBrand>("Brand", BrandSchema)

export default Brand
