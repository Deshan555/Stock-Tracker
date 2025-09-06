import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IClothes extends Document {
  patternCode?: string;
  name: string;
  category: string;
  wholesalePrice: number;
  prisedPrice: number;
  salePrice: number;
  discountedPrice: number;
  stockStatus?: string;
  quantity: number;
  capitalRecordId: Types.ObjectId;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ClothesSchema = new Schema<IClothes>({
  patternCode: { type: String },
  name: { type: String, required: true },
  category: { type: String, required: true },
  wholesalePrice: { type: Number, required: true },
  prisedPrice: { type: Number },
  salePrice: { type: Number },
  discountedPrice: { type: Number },
  quantity: { type: Number, required: true },
  capitalRecordId: { type: Schema.Types.ObjectId, ref: 'CapitalRecord', required: true },
  color: { type: String },
  stockStatus: { type: String, enum: ['IN_STOCK', 'SOLD_OUT', 'LOW_STOCK'], default: 'IN_STOCK' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Clothes || mongoose.model<IClothes>('Clothes', ClothesSchema);
