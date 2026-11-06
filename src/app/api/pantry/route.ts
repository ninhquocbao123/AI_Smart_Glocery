import {
  body,
  fail,
  userRequired,
  sameOrigin,
  ApiError,
  stringValue,
} from "@/lib/server/http";
import { requirePlan } from "@/lib/server/membership";
import { Pantry } from "@/models/Membership";
export async function GET() {
  try {
    const u = await userRequired();
    return Response.json({
      items: await Pantry.find({ userId: String(u._id) }).sort({
        expiresAt: 1,
      }),
    });
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const u = await userRequired(),
      userId = String(u._id);
    await requirePlan(userId, "plus");
    const d = await body(req);
    if (d.action === "delete") {
      await Pantry.deleteOne({ _id: stringValue(d.id), userId });
      return Response.json({ ok: true });
    }
    if (d.action === "use") {
      const quantity = Number(d.quantity);
      if (!Number.isFinite(quantity) || quantity <= 0)
        throw new ApiError(400, "Số lượng không hợp lệ.");
      const item = await Pantry.findOneAndUpdate(
        { _id: stringValue(d.id), userId, quantity: { $gte: quantity } },
        { $inc: { quantity: -quantity } },
        { new: true },
      );
      if (!item) throw new ApiError(409, "Không đủ nguyên liệu.");
      return Response.json({ item });
    }
    const name = stringValue(d.name, 1, 100),
      unit = stringValue(d.unit, 1, 30),
      location = stringValue(d.location, 0, 100),
      expiresAt = stringValue(d.expiresAt, 0, 10),
      quantity = Number(d.quantity);
    if (
      !Number.isFinite(quantity) ||
      quantity <= 0 ||
      quantity > 100000 ||
      (expiresAt &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(expiresAt) ||
          !Number.isFinite(Date.parse(expiresAt))))
    )
      throw new ApiError(400, "Kiểm tra số lượng và hạn dùng.");
    const fields = { name, unit, location, expiresAt, quantity };
    const item = d.id
      ? await Pantry.findOneAndUpdate(
          { _id: stringValue(d.id), userId },
          { $set: fields },
          { new: true },
        )
      : await Pantry.create({ userId, ...fields });
    return Response.json({ item });
  } catch (e) {
    return fail(e);
  }
}
