import {
  body,
  fail,
  sameOrigin,
  userRequired,
  stringValue,
  ApiError,
} from "@/lib/server/http";
import { requirePlan } from "@/lib/server/membership";
import { MealPlan, Pantry } from "@/models/Membership";
import { quoteCart } from "@/lib/server/quote";
import type { Ingredient } from "@/data/mockData";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const u = await userRequired(),
      userId = String(u._id);
    const m = await requirePlan(userId, "vip");
    const d = await body(req);
    const plan = await MealPlan.findOne({ _id: stringValue(d.id), userId });
    if (!plan) throw new ApiError(404, "Không tìm thấy thực đơn.");
    const today = new Date().toLocaleDateString("en-CA", {
      timeZone: "Asia/Ho_Chi_Minh",
    });
    const pantry =
      m.plan === "plus" && d.subtract
        ? await Pantry.find({
            userId,
            quantity: { $gt: 0 },
            $or: [{ expiresAt: { $gte: today } }, { expiresAt: "" }],
          })
        : [];
    const items = plan.shopping.map((i: Ingredient) => {
      const available = pantry
        .filter(
          (p) =>
            p.name.trim().toLowerCase() === i.name.trim().toLowerCase() &&
            p.unit.trim().toLowerCase() === i.unit.trim().toLowerCase(),
        )
        .reduce((s, p) => s + p.quantity, 0);
      return {
        ...i,
        required: i.quantity,
        available,
        quantity: Math.max(0, i.quantity - available),
        recipeId: plan.meals.find(
          (x: { recipe: { ingredients: Ingredient[] } }) =>
            x.recipe.ingredients.some((j) => j.id === i.id),
        )?.recipe.id,
      };
    });
    const comparisons = [];
    if (d.compare) {
      await requirePlan(userId, "plus");
      for (const store of ["Winmart", "Bach Hoa Xanh", "Coop Food"]) {
        try {
          const cart = items
            .filter((i: Ingredient) => i.quantity > 0)
            .map((i: Ingredient & { recipeId: string }) => ({
              id: i.id,
              recipeId: i.recipeId,
              quantity: Math.ceil(i.quantity),
            }));
          if (!cart.length) {
            comparisons.push({
              store,
              total: 0,
              deliveryFee: 0,
              mode: "none",
              items: [],
              complete: true,
            });
            continue;
          }
          comparisons.push({
            ...(await quoteCart(cart, store)),
            complete: true,
          });
        } catch {
          comparisons.push({
            store,
            complete: false,
            message: "Chưa đủ giá / tồn kho để báo giá toàn bộ giỏ.",
          });
        }
      }
    }
    return Response.json({ items, comparisons });
  } catch (e) {
    return fail(e);
  }
}
