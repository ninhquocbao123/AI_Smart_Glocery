import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  store: string;
  amount: number; // negative for expense, positive for income (if any)
  category: string;
  categoryColor: string;
  storeImage: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: { type: String, required: true },
    store: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    categoryColor: { type: String, required: true },
    storeImage: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
