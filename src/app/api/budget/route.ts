import { currentUser } from "@/lib/session";
import Order from "@/models/Order";
export async function GET() {
  try {
    const user = await currentUser();
    if (!user)
      return Response.json({ message: "Vui lòng đăng nhập." }, { status: 401 });
    return Response.json({
      orders: await Order.find({
        userId: String(user._id),
        $or: [
          { mode: "live", paymentStatus: "paid", "payment.environment": { $ne: "sandbox" } },
          { mode: { $ne: "live" }, status: { $in: ["completed", "delivered"] } },
        ],
      }).sort({ createdAt: -1 }),
      monthlyBudgetTarget: user.monthlyBudgetTarget,
    });
  } catch {
    return Response.json(
      { message: "Không thể tải chi tiêu." },
      { status: 503 },
    );
  }
}
