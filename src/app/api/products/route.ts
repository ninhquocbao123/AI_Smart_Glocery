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
    return Response.json({
      products,
      source: "managed-catalog",
      retailerApiConnected: false,
    });
  } catch (e) {
    return fail(e);
  }
}
