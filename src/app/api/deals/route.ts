import { readCatalog } from "@/lib/server/catalog-data";
import { Offer } from "@/models/Commerce";
import dbConnect from "@/lib/mongodb";
import { isLive } from "@/lib/server/config";
import { fail } from "@/lib/server/http";
export async function GET() {
  try {
    if (!isLive()) return Response.json({ deals: (await readCatalog()).deals, demo: true });
    await dbConnect();
    const offers = await Offer.find({
      active: true,
      stock: { $gt: 0 },
      validUntil: { $gt: new Date() },
      $expr: { $gt: ["$originalPrice", "$price"] },
    })
      .limit(100)
      .lean();
    return Response.json({
      demo: false,
      deals: offers.map((o) => ({
        id: String(o._id),
        ingredientId: o.ingredientId,
        name: o.name,
        price: o.price,
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
