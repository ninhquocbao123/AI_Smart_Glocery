import { goldenConfig } from "@/lib/server/golden-hours";
import { goldenPrice } from "@/lib/golden-hours";
import dbConnect from "@/lib/mongodb";
import { Offer } from "@/models/Commerce";
import { fail } from "@/lib/server/http";
export async function GET(req: Request) {
  try {
    await dbConnect();
    const store = new URL(req.url).searchParams.get("store");
    const products = await Offer.find({
      ...(store ? { store } : {}),
      active: true,
      validUntil: { $gt: new Date() },
    })
      .select("-updatedBy -__v")
      .limit(200)
      .lean();
    const config = await goldenConfig();
    return Response.json({
      products: products.map((p) => ({
        ...p,
        price: goldenPrice(p.price, p.originalPrice, p.ingredientId, config),
      })),
      source: "managed-catalog",
      retailerApiConnected: false,
    });
  } catch (e) {
    return fail(e);
  }
}
