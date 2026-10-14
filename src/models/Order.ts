import mongoose, { Schema } from "mongoose";
const schema = new Schema(
  {
    userId: { type: String, required: true, index: true },
    orderId: { type: String, required: true, unique: true },
    items: { type: [Schema.Types.Mixed], required: true },
    store: String,
    address: String,
    total: Number,
    deliveryFee: Number,
    paymentMethod: String,
    status: {
      type: String,
      enum: [
        "unpaid",
        "confirmed",
        "delivering",
        "delivered",
        "completed",
        "cancelled",
      ],
      default: "unpaid",
    },
    schemaVersion: Number,
    mode: { type: String, enum: ["demo", "live"] },
    clientRequestId: String,
    requestHash: String,
    phone: String,
    sellerName: String,
    branch: String,
    inventoryReserved: Boolean,
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "cod", "failed", "review"],
    },
    paidAt: Date,
    payment: {
      provider: String,
      reference: String,
      requestId: String,
      environment: String,
      orderCode: Number,
      checkoutUrl: String,
      startedAt: Date,
      transactionId: String,
      settledAt: Date,
    },
  },
  { timestamps: true },
);
schema.index(
  { userId: 1, clientRequestId: 1 },
  {
    unique: true,
    partialFilterExpression: { clientRequestId: { $type: "string" } },
  },
);
schema.index({ "payment.reference": 1 }, { unique: true, sparse: true });
schema.index({ "payment.orderCode": 1 }, { unique: true, sparse: true });
export default mongoose.models.Order || mongoose.model("Order", schema);
