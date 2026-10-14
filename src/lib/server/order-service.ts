import mongoose from "mongoose";
import { randomUUID, randomInt, createHash } from "node:crypto";
import Order from "@/models/Order";
import { Offer } from "@/models/Commerce";
import { quoteCart, parseCart } from "./quote";
import { ApiError, integer, stringValue } from "./http";
import { isLive, paymentReady } from "./config";

export function validateCheckout(data: Record<string, unknown>) {
  const items = parseCart(data.items),
    store = stringValue(data.store);
  const address = stringValue(data.address, 10, 300),
    phone = stringValue(data.phone, 9, 20);
  if (!/^\+?[\d ()-]{9,20}$/.test(phone))
    throw new ApiError(400, "Số điện thoại không hợp lệ.");
  const paymentMethod = stringValue(data.paymentMethod);
  if (!["cod", "bank", "momo", "demo"].includes(paymentMethod))
    throw new ApiError(400, "Phương thức không hợp lệ.");
  const clientRequestId = stringValue(data.clientRequestId, 16, 100);
  const expectedTotal = integer(data.expectedTotal, 1000, 50000000);
  return {
    items,
    store,
    address,
    phone,
    paymentMethod,
    clientRequestId,
    expectedTotal,
  };
}
export async function placeOrder(
  userId: string,
  data: Record<string, unknown>,
) {
  const input = validateCheckout(data);
  const requestHash = createHash("sha256")
    .update(JSON.stringify(input))
    .digest("hex");
  const existing = await Order.findOne({
    userId,
    clientRequestId: input.clientRequestId,
  });
  if (existing) {
    if (existing.requestHash !== requestHash)
      throw new ApiError(409, "Yêu cầu này đã dùng cho một giỏ hàng khác.");
    return existing;
  }
  if (isLive() && !paymentReady(input.paymentMethod))
    throw new ApiError(503, "Phương thức thanh toán chưa sẵn sàng.");
  const orderId = "SG-" + randomUUID();
  if (!isLive()) {
    const quote = await quoteCart(input.items, input.store);
    if (quote.total !== input.expectedTotal) throw new ApiError(409, "Giá đã thay đổi. Vui lòng tải lại báo giá.");
    try {
      return await Order.create({ ...quote, schemaVersion: 2, userId, orderId,
        address: input.address, phone: input.phone, paymentMethod: input.paymentMethod,
        clientRequestId: input.clientRequestId, requestHash, inventoryReserved: false,
        status: input.paymentMethod === "cod" ? "confirmed" : "unpaid",
        paymentStatus: input.paymentMethod === "cod" ? "cod" : "pending",
        payment: { provider: input.paymentMethod, environment: input.paymentMethod === "momo" ? "sandbox" : "demo",
          reference: orderId, requestId: randomUUID(), orderCode: Date.now() * 1000 + randomInt(1000) },
      });
    } catch (error) {
      if ((error as {code?:number}).code === 11000) {
        const duplicate = await Order.findOne({userId,clientRequestId:input.clientRequestId});
        if (duplicate?.requestHash === requestHash) return duplicate;
      }
      throw error;
    }
  }
  const session = await mongoose.startSession();
  let order;
  try {
    await session.withTransaction(async () => {
      const quote = await quoteCart(input.items, input.store, session);
      if (quote.total !== input.expectedTotal)
        throw new ApiError(
          409,
          "Giá đã thay đổi. Vui lòng tải lại báo giá trước khi đặt.",
        );
      if (isLive())
        for (const item of quote.items) {
          const changed = await Offer.updateOne(
            {
              store: quote.store,
              ingredientId: item.ingredient.id,
              active: true,
              price: item.ingredient.price,
              validUntil: { $gt: new Date() },
              stock: { $gte: item.quantity },
            },
            { $inc: { stock: -item.quantity } },
            { session },
          );
          if (!changed.modifiedCount)
            throw new ApiError(
              409,
              "Tồn kho vừa thay đổi. Vui lòng kiểm tra lại giỏ.",
            );
        }
      const docs = await Order.create(
        [
          {
            ...quote,
            schemaVersion: 2,
            userId,
            orderId,
            address: input.address,
            phone: input.phone,
            paymentMethod: input.paymentMethod,
            clientRequestId: input.clientRequestId,
            requestHash,
            inventoryReserved: isLive(),
            status: input.paymentMethod === "cod" ? "confirmed" : "unpaid",
            paymentStatus: input.paymentMethod === "cod" ? "cod" : "pending",
            ...(input.paymentMethod === "cod"
              ? {}
              : {
                  payment: {
                    provider: input.paymentMethod,
                    environment:
                      input.paymentMethod === "momo" &&
                      process.env.MOMO_ENV !== "production"
                        ? "sandbox"
                        : "production",
                    reference: orderId,
                    requestId: randomUUID(),
                    orderCode: Date.now() * 1000 + randomInt(1000),
                  },
                }),
          },
        ],
        { session },
      );
      order = docs[0];
    });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) {
      const duplicate = await Order.findOne({
        userId,
        clientRequestId: input.clientRequestId,
      });
      if (duplicate?.requestHash === requestHash) return duplicate;
    }
    throw error;
  } finally {
    await session.endSession();
  }
  return order;
}
export async function cancelOrder(userId: string, orderId: string) {
  const demo = await Order.findOneAndUpdate({ userId, orderId, mode: "demo", status: {$in:["unpaid","confirmed"]},
    paymentStatus: {$nin:["paid","review"]}, "payment.startedAt": {$exists:false} }, {$set:{status:"cancelled"}}, {new:true});
  if(demo)return demo;
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const result = await Order.findOneAndUpdate(
        {
          userId,
          orderId,
          status: { $in: ["unpaid", "confirmed"] },
          paymentStatus: { $nin: ["paid", "review"] },
          "payment.startedAt": { $exists: false },
        },
        { $set: { status: "cancelled", inventoryReserved: false } },
        { session },
      );
      if (!result)
        throw new ApiError(
          409,
          "Đơn đã thanh toán/đang xử lý. Vui lòng liên hệ hỗ trợ để hủy và đối soát.",
        );
      if (result.inventoryReserved)
        for (const item of result.items) {
          const restored = await Offer.updateOne(
            { store: result.store, ingredientId: item.ingredient.id },
            { $inc: { stock: item.quantity } },
            { session },
          );
          if (!restored.matchedCount)
            throw new ApiError(
              409,
              "Cần quản trị viên xử lý tồn kho của đơn này.",
            );
        }
    });
  } finally {
    await session.endSession();
  }
  return Order.findOne({ userId, orderId });
}
export async function settlePayment(
  reference: string,
  provider: string,
  amount: number,
  transactionId: string,
) {
  if (!Number.isSafeInteger(amount) || amount < 1000 || !transactionId)
    throw new ApiError(400, "Thông tin thanh toán không hợp lệ.");
  const order = await Order.findOne({
    "payment.reference": reference,
    "payment.provider": provider,
    $or: [{mode:"live"},{mode:"demo", "payment.environment":"sandbox", "payment.provider":"momo"}],
  });
  if (!order || order.total !== amount)
    throw new ApiError(400, "Giao dịch không khớp đơn hàng.");
  if (order.paymentStatus === "paid" || order.paymentStatus === "review")
    return order;
  // Atomic update: duplicate notifications cannot credit twice or regress fulfillment.
  return Order.findOneAndUpdate(
    { _id: order._id, paymentStatus: { $nin: ["paid", "review"] } },
    [
      {
        $set: {
          paymentStatus: {
            $cond: [{ $eq: ["$status", "cancelled"] }, "review", "paid"],
          },
          status: {
            $cond: [{ $eq: ["$status", "unpaid"] }, "confirmed", "$status"],
          },
          paidAt: new Date(),
          "payment.settledAt": new Date(),
          "payment.transactionId": { $literal: transactionId },
        },
      },
    ],
    { new: true },
  );
}
