import { goldenConfig } from "@/lib/server/golden-hours";
import { goldenPrice, goldenStatus } from "@/lib/golden-hours";
import { readCatalog } from "@/lib/server/catalog-data";
import { Offer } from "@/models/Commerce";
import dbConnect from "@/lib/mongodb";
import { isLive } from "@/lib/server/config";
import { fail } from "@/lib/server/http";
export async function GET() {
  try {
    const config = await goldenConfig();
    const golden = goldenStatus(config);
    if (!isLive())
      return Response.json({
        golden,
        deals: (await readCatalog()).deals.filter(d => config.selectedIds?.includes(d.ingredientId)).slice(0,20).map((d) => ({
          ...d,
          dealPrice: d.price,
          price: goldenPrice(d.price, d.originalPrice, d.ingredientId, config),
          originalPrice: d.originalPrice,
        })),
        demo: true,
      });
    await dbConnect();
    const offers = await Offer.find({
      ingredientId: { $in: config.selectedIds ?? [] },
      active: true,
      stock: { $gt: 0 },
      validUntil: { $gt: new Date() },
      $expr: { $gt: ["$originalPrice", "$price"] },
    })
      .limit(100)
      .lean();
    return Response.json({
      demo: false,
      golden,
      deals: offers.filter((o,i,rows)=>rows.findIndex(r=>r.ingredientId===o.ingredientId)===i).slice(0,20).map((o) => ({
        id: String(o._id),
        ingredientId: o.ingredientId,
        name: o.name,
        dealPrice: o.price,
        price: goldenPrice(o.price, o.originalPrice, o.ingredientId, config),
        originalPrice: o.originalPrice,
        unit: o.unit,
        store: o.store,
        category: o.category,
        discount: Math.round((1 - o.price / o.originalPrice) * 100),
        image: "",
        expiresIn: new Date(o.validUntil).toLocaleString("vi-VN", {
          timeZone: "Asia/Ho_Chi_Minh",
        }),
        badge: "Nhóm cập nhật",
      })),
    });
  } catch (e) {
    return fail(e);
  }
}
