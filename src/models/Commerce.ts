import mongoose, { Schema } from "mongoose";
const storeSchema = new Schema(
  {
    key: { type: String, unique: true, required: true },
    name: String,
    branch: String,
    sellerName: String,
    serviceArea: String,
    deliveryFee: { type: Number, min: 0, default: 0 },
    acceptingOrders: { type: Boolean, default: false },
    fulfillment: { type: String, enum: ["manual"], default: "manual" },
  },
  { timestamps: true },
);
const offerSchema = new Schema(
  {
    store: { type: String, required: true },
    ingredientId: { type: String, required: true },
    sku: { type: String, required: true },
    name: { type: String, required: true },
    unit: { type: String, required: true },
    category: String,
    price: { type: Number, required: true, min: 0 },
    originalPrice: Number,
    stock: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
    source: { type: String, enum: ["manual", "partner"], default: "manual" },
    validUntil: { type: Date, required: true },
    updatedBy: String,
  },
  { timestamps: true },
);
offerSchema.index({ store: 1, ingredientId: 1 }, { unique: true });
offerSchema.index({ store: 1, sku: 1 }, { unique: true });
export const RetailStore =
  mongoose.models.RetailStore || mongoose.model("RetailStore", storeSchema);
export const Offer =
  mongoose.models.Offer || mongoose.model("Offer", offerSchema);
