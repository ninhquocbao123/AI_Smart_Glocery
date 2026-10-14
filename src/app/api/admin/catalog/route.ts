import { Offer, RetailStore } from "@/models/Commerce";
import { storeDirectory } from "@/lib/stores";
import {
  adminRequired,
  ApiError,
  body,
  fail,
  integer,
  sameOrigin,
  stringValue,
} from "@/lib/server/http";
export async function GET() {
  try {
    await adminRequired();
    return Response.json({
      stores: await RetailStore.find(),
      offers: await Offer.find().limit(500),
    });
  } catch (e) {
    return fail(e);
  }
}
export async function PUT(req: Request) {
  try {
    sameOrigin(req);
    const user = await adminRequired();
    const data = await body(req);
    const store = stringValue(data.store);
    if (!storeDirectory.some((s) => s.key === store))
      throw new ApiError(400, "Cửa hàng không hợp lệ.");
    if (data.kind === "store") {
      if (typeof data.acceptingOrders !== "boolean")
        throw new ApiError(400, "Thiếu trạng thái nhận đơn.");
      const values = {
        name: storeDirectory.find((s) => s.key === store)!.name,
        branch: stringValue(data.branch),
        sellerName: stringValue(data.sellerName),
        serviceArea: stringValue(data.serviceArea),
        deliveryFee: integer(data.deliveryFee, 0, 1000000),
        acceptingOrders: data.acceptingOrders,
        fulfillment: "manual",
      };
      return Response.json({
        store: await RetailStore.findOneAndUpdate(
          { key: store },
          { $set: values },
          { upsert: true, new: true, runValidators: true },
        ),
      });
    }
    const validUntil = new Date(stringValue(data.validUntil));
    if (
      !Number.isFinite(validUntil.getTime()) ||
      validUntil <= new Date() ||
      validUntil.getTime() > Date.now() + 7 * 86400000
    )
      throw new ApiError(400, "Giá cần hạn hiệu lực trong 7 ngày tới.");
    const values = {
      sku: stringValue(data.sku),
      name: stringValue(data.name),
      unit: stringValue(data.unit, 1, 30),
      category: stringValue(data.category, 1, 60),
      price: integer(data.price, 1, 50000000),
      stock: integer(data.stock, 0, 10000000),
      originalPrice:
        data.originalPrice == null
          ? undefined
          : integer(data.originalPrice, 1, 50000000),
      active: data.active !== false,
      source: "manual",
      validUntil,
      updatedBy: String(user._id),
    };
    return Response.json({
      offer: await Offer.findOneAndUpdate(
        { store, ingredientId: stringValue(data.ingredientId, 1, 100) },
        { $set: values },
        { upsert: true, new: true, runValidators: true },
      ),
    });
  } catch (e) {
    return fail(e);
  }
}
