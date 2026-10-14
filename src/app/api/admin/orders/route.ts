import Order from "@/models/Order";
import {
  adminRequired,
  ApiError,
  body,
  fail,
  sameOrigin,
  stringValue,
} from "@/lib/server/http";
export async function GET() {
  try {
    await adminRequired();
    return Response.json({
      orders: await Order.find().sort({ createdAt: -1 }).limit(200),
    });
  } catch (e) {
    return fail(e);
  }
}
export async function PATCH(req: Request) {
  try {
    sameOrigin(req);
    await adminRequired();
    const data = await body(req);
    const orderId = stringValue(data.orderId, 1, 100);
    if (data.action === "confirmCod") {
      const order = await Order.findOneAndUpdate(
        {
          orderId,
          paymentMethod: "cod",
          paymentStatus: "cod",
          status: { $in: ["delivered", "completed"] },
        },
        { $set: { paymentStatus: "paid", paidAt: new Date() } },
        { new: true },
      );
      if (!order)
        throw new ApiError(
          409,
          "Chỉ xác nhận COD khi đơn đã giao và chưa ghi nhận thu tiền.",
        );
      return Response.json({ order });
    }
    const from =
      data.status === "delivering"
        ? ["confirmed"]
        : data.status === "delivered"
          ? ["delivering"]
          : [];
    if (!from.length)
      throw new ApiError(400, "Chỉ cập nhật đang giao hoặc đã giao.");
    const order = await Order.findOneAndUpdate(
      {
        orderId,
        status: { $in: from },
        $or: [
          { paymentStatus: "paid" },
          { paymentMethod: "cod" },
          { mode: "demo" },
        ],
      },
      { $set: { status: data.status } },
      { new: true },
    );
    if (!order) throw new ApiError(409, "Trạng thái đơn không hợp lệ.");
    return Response.json({ order });
  } catch (e) {
    return fail(e);
  }
}
