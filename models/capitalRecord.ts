import mongoose, { Schema, Document } from 'mongoose';

export interface ICapitalRecord extends Document {
  amountInvested: number;
  description: string;
  createdAt: Date;
  remainingBalance: number;
}

const CapitalRecordSchema = new Schema<ICapitalRecord>({
  amountInvested: { type: Number, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  remainingBalance: { type: Number, required: false },
});

export default mongoose.models.CapitalRecord || mongoose.model<ICapitalRecord>('CapitalRecord', CapitalRecordSchema);
