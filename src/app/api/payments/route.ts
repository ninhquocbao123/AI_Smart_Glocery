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
import { createPayment, queryPayment } from "@/lib/server/providers";
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
    let order = await Order.findOne({ orderId: id, userId: String(user._id) });
    if (
      !order ||
      !(order.mode === "live" || (order.mode === "demo" && order.paymentMethod === "momo" && order.payment?.environment === "sandbox" && process.env.MOMO_ENV !== "production")) ||
      !["bank", "momo"].includes(order.paymentMethod)
    )
      throw new ApiError(409, "Đơn này không hỗ trợ thanh toán trực tuyến.");
    if (order.paymentStatus === "paid")
      return Response.json({ order, paid: true });
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
      return Response.json({ order, paid: result.paid });
    }
    if (order.status !== "unpaid" || !paymentReady(order.paymentMethod))
      throw new ApiError(409, "Đơn hoặc cổng thanh toán chưa sẵn sàng.");
    if (order.payment.checkoutUrl)
      return Response.json({ checkoutUrl: order.payment.checkoutUrl });
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
    const checkoutUrl = await createPayment(order);
    await Order.updateOne(
      { _id: order._id },
      { $set: { "payment.checkoutUrl": checkoutUrl } },
    );
    return Response.json({ checkoutUrl });
  } catch (e) {
    return fail(e);
  }
}
