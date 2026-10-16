import Order from "@/models/Order";
import {
  ApiError,
  body,
  fail,
  rateLimit,
  sameOrigin,
  stringValue,
  userRequired,
} from "@/lib/server/http";
import { createBankPayment, createPayment, queryPayment } from "@/lib/server/providers";
import QRCode from "qrcode";
import { settlePayment } from "@/lib/server/order-service";
import { paymentReady } from "@/lib/server/config";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const user = await userRequired();
    await rateLimit("payments:" + user._id, 8);
    const data = await body(req),
      id = stringValue(data.orderId, 1, 100);
    if (data.action !== "create" && data.action !== "check")
      throw new ApiError(400, "Thao tác thanh toán không hợp lệ.");
    let order = await Order.findOne({ orderId: id, userId: String(user._id) });
    if (
      !order ||
      !(order.mode === "live" || (order.mode === "demo" && order.paymentMethod === "momo" && order.payment?.environment === "sandbox" && process.env.MOMO_ENV !== "production")) ||
      !["bank", "momo"].includes(order.paymentMethod)
    )
      throw new ApiError(409, "Đơn này không hỗ trợ thanh toán trực tuyến.");
    if (order.paymentStatus === "paid")
      return Response.json({ order, paid: true });
    if (order.status === "cancelled" || order.paymentStatus === "review")
      return Response.json({ order, paid: false, terminal: true });
    if (data.action === "check") {
      if (!order.payment?.startedAt)
        return Response.json({ order, paid: false });
      const result = await queryPayment(order);
      if (result.paid)
        order = await settlePayment(
          order.payment.reference,
          order.paymentMethod,
          result.amount,
          result.transactionId,
        );
      return Response.json({ order, paid: order?.paymentStatus === "paid", providerStatus: "status" in result ? result.status : undefined });
    }
    if (order.status !== "unpaid" || !paymentReady(order.paymentMethod))
      throw new ApiError(409, "Đơn hoặc cổng thanh toán chưa sẵn sàng.");
    if (order.payment.checkoutUrl)
      return await paymentResponse(order);
    if (order.payment.startedAt)
      throw new ApiError(
        409,
        "Phiên thanh toán đã được yêu cầu. Hãy kiểm tra trạng thái; liên hệ hỗ trợ nếu chưa nhận được link.",
      );
    order = await Order.findOneAndUpdate(
      {
        _id: order._id,
        status: "unpaid",
        "payment.startedAt": { $exists: false },
      },
      { $set: { "payment.startedAt": new Date() } },
      { new: true },
    );
    if (!order) throw new ApiError(409, "Thanh toán đang được xử lý.");
    const details = order.paymentMethod === "bank"
      ? await createBankPayment(order)
      : { checkoutUrl: await createPayment(order) };
    await Order.updateOne(
      { _id: order._id },
      { $set: Object.fromEntries(Object.entries(details).map(([key, value]) => ["payment." + key, value])) },
    );
    order = await Order.findById(order._id);
    return await paymentResponse(order);
  } catch (e) {
    return fail(e);
  }
}

async function paymentResponse(order: { orderId: string; total: number; payment: { checkoutUrl?: string; qrCode?: string; accountNumber?: string; accountName?: string; bankBin?: string; description?: string; expiresAt?: number } }) {
  const p = order.payment;
  return Response.json({
    orderId: order.orderId, total: order.total, checkoutUrl: p.checkoutUrl,
    bank: p.qrCode ? {
      qrImage: await QRCode.toDataURL(p.qrCode, { width: 360, margin: 4, errorCorrectionLevel: "M" }),
      accountNumber: p.accountNumber, accountName: p.accountName, bankBin: p.bankBin,
      description: p.description, expiresAt: p.expiresAt,
    } : null,
  }, { headers: { "Cache-Control": "no-store" } });
}
