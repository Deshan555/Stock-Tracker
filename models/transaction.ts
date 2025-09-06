import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
  type: 'purchase' | 'sale' | 'expense' | 'deposit';
  amount: number;
  referenceId: Types.ObjectId;
  description: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  type: { type: String, enum: ['purchase', 'sale', 'expense', 'deposit'], required: true },
  amount: { type: Number, required: true },
  referenceId: { type: Schema.Types.ObjectId, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
