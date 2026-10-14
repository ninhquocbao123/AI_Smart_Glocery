import Order from "@/models/Order";
import dbConnect from "@/lib/mongodb";
import { ApiError, body, fail } from "@/lib/server/http";
import { payosClient } from "@/lib/server/providers";
import { settlePayment } from "@/lib/server/order-service";
export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    const raw = await body(req);
    let data;
    try {
      data = await payosClient().webhooks.verify(raw as never);
    } catch {
      throw new ApiError(400, "Chữ ký không hợp lệ.");
    }
    await dbConnect();
    const order = await Order.findOne({
      "payment.orderCode": data.orderCode,
      "payment.provider": "bank",
      mode: "live",
    });
    // Acknowledge signed registration probes without crediting unknown orders.
    if (!order) return Response.json({ received: true });
    if (data.code === "00" && data.currency === "VND")
      await settlePayment(
        order.payment.reference,
        "bank",
        data.amount,
        data.reference,
      );
    return Response.json({ received: true });
  } catch (e) {
    return fail(e);
  }
}
