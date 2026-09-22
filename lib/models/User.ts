import mongoose, { Schema, Model, Document } from "mongoose"

export interface IAddress {
  address: string
  country: string
  city: string
  state?: string
  postal_code?: string
  phone: string
  set_default: boolean
}

export interface IUser extends Document {
  name: string
  email?: string
  phone?: string
  password?: string
  user_type: "customer" | "admin" | "seller" | "delivery_boy"
  avatar?: string
  addresses: IAddress[]
  email_verified_at?: Date
  phone_verified_at?: Date
  balance: number
  banned: boolean
  createdAt: Date
  updatedAt: Date
}

const AddressSchema = new Schema<IAddress>(
  {
    address: { type: String, required: true },
    country: { type: String, default: "Bangladesh" },
    city: { type: String, required: true },
    state: { type: String, default: "" },
    postal_code: { type: String, default: "" },
    phone: { type: String, required: true },
    set_default: { type: Boolean, default: false },
  },
  { _id: true }
)

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, index: true, sparse: true },
    phone: { type: String, trim: true, index: true, sparse: true },
    password: { type: String },
    user_type: {
      type: String,
      enum: ["customer", "admin", "seller", "delivery_boy"],
      default: "customer",
    },
    avatar: { type: String, default: "" },
    addresses: [AddressSchema],
    email_verified_at: { type: Date },
    phone_verified_at: { type: Date },
    balance: { type: Number, default: 0 },
    banned: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema)

export default User
