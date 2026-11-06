import Order from "@/models/Order";
import {
  adminRequired,
  ApiError,
  body,
  fail,
  sameOrigin,
  stringValue,
} from "@/lib/server/http";
export async function GET(req: Request) {
  try {
    await adminRequired();
    const params = new URL(req.url).searchParams;
    const status = params.get("status") || "all";
    if (!["all", "unpaid", "confirmed", "delivering", "delivered", "completed", "cancelled"].includes(status))
      throw new ApiError(400, "Trạng thái đơn không hợp lệ.");
    const page = Number(params.get("page") || 1);
    if (!Number.isSafeInteger(page) || page < 1 || page > 100000)
      throw new ApiError(400, "Trang không hợp lệ.");
    const search = (params.get("q") || "").trim();
    if (search.length > 100) throw new ApiError(400, "Từ khóa tối đa 100 ký tự.");
    const literal = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = {
      kind: { $ne: "membership" },
      ...(status === "all" ? {} : { status }),
      ...(search ? { $or: ["orderId", "phone", "address"].map(field => ({ [field]: { $regex: literal, $options: "i" } })) } : {}),
    };
    const limit = 25;
    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * limit).limit(limit),
      Order.countDocuments(filter),
    ]);
    return Response.json({ orders, total, page, pages: Math.max(1, Math.ceil(total / limit)) },
      { headers: { "Cache-Control": "no-store" } });
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
          kind: { $ne: "membership" },
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
        kind: { $ne: "membership" },
        status: { $in: from },
        $or: [
          { paymentStatus: "paid" },
          { paymentMethod: "cod", paymentStatus: "cod" },
        ],
      },
      { $set: {
        status: data.status,
        [data.status === "delivering" ? "fulfillment.shippedAt" : "fulfillment.deliveredAt"]: new Date(),
      } },
      { new: true },
    );
    if (!order) throw new ApiError(409, "Trạng thái đơn không hợp lệ.");
    return Response.json({ order });
  } catch (e) {
    return fail(e);
  }
}
