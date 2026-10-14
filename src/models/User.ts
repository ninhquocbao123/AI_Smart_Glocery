import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  role?: string;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  diet?: string;
  allergies?: string[];
  monthlyBudgetTarget?: number;
  memberTier?: string;
  joinYear?: number;
  points?: string;
  orders?: number;
}

const UserSchema: Schema = new Schema(
  {
    role: { type: String, enum: ["user", "admin"], default: "user" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    diet: { type: String, default: "Không hạn chế" },
    allergies: { type: [String], default: [] },
    monthlyBudgetTarget: { type: Number, default: 1500000 },
    memberTier: { type: String, default: "Thành viên Tiêu chuẩn" },
    joinYear: { type: Number, default: () => new Date().getFullYear() },
    points: { type: String, default: "0" },
    orders: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
