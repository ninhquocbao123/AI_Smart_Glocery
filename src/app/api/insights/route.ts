import { fail, userRequired } from "@/lib/server/http";
import { requirePlan } from "@/lib/server/membership";
import Order from "@/models/Order";
export async function GET() {
  try {
    const u = await userRequired();
    await requirePlan(String(u._id), "plus");
    const now = new Date(),
      local = new Date(+now + 7 * 3600000),
      start = new Date(
        Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), 1) - 7 * 3600000,
      ),
      previous = new Date(
        Date.UTC(local.getUTCFullYear(), local.getUTCMonth() - 1, 1) -
          7 * 3600000,
      );
    const orders = await Order.find({
      userId: String(u._id),
      kind: { $ne: "membership" },
      mode: "live",
      paymentStatus: "paid",
      "payment.environment": { $nin: ["sandbox", "demo"] },
      status: { $nin: ["cancelled"] },
      paidAt: { $gte: previous },
    });
    let current = 0,
      before = 0,
      delivery = 0;
    const categories: Record<string, number> = {},
      weeks: Record<string, number> = {};
    for (const o of orders) {
      if (new Date(o.paidAt) < start) {
        before += o.total;
        continue;
      }
      current += o.total;
      delivery += o.deliveryFee ?? 0;
      const day = new Date(+new Date(o.paidAt) + 7 * 3600000).getUTCDate();
      const week = "Tuần " + Math.ceil(day / 7);
      weeks[week] = (weeks[week] ?? 0) + o.total;
      for (const i of o.items) {
        const category = i.ingredient.category ?? "Khác";
        categories[category] =
          (categories[category] ?? 0) + i.ingredient.price * i.quantity;
      }
    }
    return Response.json({
      current,
      previous: before,
      delivery,
      categories,
      weeks,
      budget: u.monthlyBudgetTarget ?? 0,
      count: orders.filter((o) => new Date(o.paidAt) >= start).length,
    });
  } catch (e) {
    return fail(e);
  }
}
