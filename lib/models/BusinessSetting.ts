import mongoose, { Schema, Model, Document } from "mongoose"

export interface IBusinessSetting extends Document {
  type: string
  value: string
  createdAt: Date
  updatedAt: Date
}

const BusinessSettingSchema = new Schema<IBusinessSetting>(
  {
    type: { type: String, required: true, unique: true, index: true },
    value: { type: String, default: "" },
  },
  { timestamps: true }
)

export const BusinessSetting: Model<IBusinessSetting> =
  mongoose.models.BusinessSetting ||
  mongoose.model<IBusinessSetting>("BusinessSetting", BusinessSettingSchema)

export default BusinessSetting
