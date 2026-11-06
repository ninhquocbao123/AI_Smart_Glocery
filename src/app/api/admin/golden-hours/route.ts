import {
  adminRequired,
  body,
  fail,
  sameOrigin,
  ApiError,
} from "@/lib/server/http";
import { GoldenSettings, goldenConfig } from "@/lib/server/golden-hours";
export async function GET() {
  try {
    await adminRequired();
    return Response.json(await goldenConfig());
  } catch (e) {
    return fail(e);
  }
}
export async function PUT(req: Request) {
  try {
    sameOrigin(req);
    await adminRequired();
    const d = await body(req);
    if (
      !Array.isArray(d.windows) ||
      !d.windows.length ||
      d.windows.length > 4 ||
      d.windows.some(
        (w) =>
          !Number.isInteger(w.start) ||
          !Number.isInteger(w.end) ||
          w.start < 0 ||
          w.end > 1440 ||
          w.end <= w.start,
      ) ||
      !Array.isArray(d.disabledIds) ||
      d.disabledIds.length > 500 ||
      d.disabledIds.some((x) => typeof x !== "string" || x.length > 100)
    )
      throw new ApiError(400, "Khung giờ hoặc mã nguyên liệu không hợp lệ.");
    await GoldenSettings.updateOne(
      { _id: "daily" },
      { $set: { windows: d.windows, disabledIds: d.disabledIds } },
      { upsert: true },
    );
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
