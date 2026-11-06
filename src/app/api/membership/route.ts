import { randomUUID, randomInt } from "node:crypto";
import {
  body,
  fail,
  sameOrigin,
  userRequired,
  ApiError,
  rateLimit,
} from "@/lib/server/http";
import { member } from "@/lib/server/membership";
import { Membership } from "@/models/Membership";
import { PLANS } from "@/lib/membership";
import Order from "@/models/Order";
import { membershipCheckout } from "@/lib/server/config";
export async function GET() {
  try {
    const u = await userRequired();
    return Response.json({
      ...(await member(String(u._id))),
      checkout: membershipCheckout(),
      history: await Membership.find({ userId: String(u._id) }).sort({
        startsAt: -1,
      }),
      purchases: await Order.find({ userId: String(u._id), kind: "membership" })
        .select(
          "orderId total status paymentStatus membershipPlan createdAt payment.environment",
        )
        .sort({ createdAt: -1 })
        .limit(30),
    });
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const u = await userRequired();
    await rateLimit("subscribe:" + u._id, 3);
    const d = await body(req);
    if (d.plan !== "vip" && d.plan !== "plus")
      throw new ApiError(400, "Gói không hợp lệ.");
    if (d.method !== "bank" && d.method !== "momo")
      throw new ApiError(400, "Chọn phương thức thanh toán.");
    if (!membershipCheckout().methods[d.method])
      throw new ApiError(
        503,
        "Thanh toán gói thật chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
      );
    const orderId = "VIP-" + randomUUID();
    await Order.create({
      userId: String(u._id),
      orderId,
      kind: "membership",
      membershipPlan: d.plan,
      items: [],
      total: PLANS[d.plan].price,
      deliveryFee: 0,
      store: "Gói thành viên",
      mode: "live",
      schemaVersion: 2,
      status: "unpaid",
      paymentStatus: "pending",
      paymentMethod: d.method,
      payment: {
        provider: d.method,
        environment: "production",
        reference: orderId,
        requestId: randomUUID(),
        orderCode: Date.now() * 1000 + randomInt(1000),
      },
    });
    return Response.json({ orderId });
  } catch (e) {
    return fail(e);
  }
}
