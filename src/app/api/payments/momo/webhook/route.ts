import Order from "@/models/Order";
import dbConnect from "@/lib/mongodb";
import { ApiError, body, fail } from "@/lib/server/http";
import { secret } from "@/lib/server/config";
import { verifyMomo } from "@/lib/server/payment-signatures";
import { settlePayment } from "@/lib/server/order-service";
export const runtime = "nodejs";
export async function POST(req: Request) {
  try {
    const data = await body(req);
    if (
      !verifyMomo(
        data,
        secret("MOMO_ACCESS_KEY"),
        secret("MOMO_SECRET_KEY"),
        secret("MOMO_PARTNER_CODE"),
      )
    )
      throw new ApiError(400, "Chữ ký không hợp lệ.");
    await dbConnect();
    const order = await Order.findOne({
      "payment.reference": data.orderId,
      "payment.requestId": data.requestId,
      "payment.provider": "momo",
      $or: [{mode:"live"},{mode:"demo","payment.environment":"sandbox"}],
    });
    if (
      !order ||
      order.total !== Number(data.amount) ||
      order.payment.environment !==
        (process.env.MOMO_ENV === "production" ? "production" : "sandbox")
    )
      throw new ApiError(400, "Giao dịch không khớp.");
    if (Number(data.resultCode) === 0)
      await settlePayment(
        String(data.orderId),
        "momo",
        Number(data.amount),
        String(data.transId),
      );
    return new Response(null, { status: 204 });
  } catch (e) {
    return fail(e);
  }
}
