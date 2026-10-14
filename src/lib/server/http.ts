import { isAdminUser } from "./roles";
import { createHash } from "node:crypto";
import mongoose, { Schema } from "mongoose";
import dbConnect from "@/lib/mongodb";
import { currentUser } from "@/lib/session";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function fail(error: unknown) {
  return Response.json(
    {
      message:
        error instanceof ApiError
          ? error.message
          : "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại.",
    },
    { status: error instanceof ApiError ? error.status : 503 },
  );
}
export async function body(req: Request) {
  if (!req.headers.get("content-type")?.includes("application/json"))
    throw new ApiError(415, "Yêu cầu JSON.");
  const reader = req.body?.getReader();
  if (!reader) throw new ApiError(400, "Thiếu dữ liệu.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 65536) {
      await reader.cancel();
      throw new ApiError(413, "Dữ liệu quá lớn.");
    }
    chunks.push(value);
  }
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw Error();
    return data as Record<string, unknown>;
  } catch {
    throw new ApiError(400, "JSON không hợp lệ.");
  }
}
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const expected = process.env.APP_URL
    ? new URL(process.env.APP_URL).origin
    : new URL(req.url).origin;
  if (origin && origin !== expected)
    throw new ApiError(403, "Nguồn yêu cầu không hợp lệ.");
  if (req.headers.get("sec-fetch-site") === "cross-site")
    throw new ApiError(403, "Nguồn yêu cầu không hợp lệ.");
}
export async function userRequired() {
  const user = await currentUser();
  if (!user) throw new ApiError(401, "Vui lòng đăng nhập.");
  return user;
}
export async function adminRequired() {
  const user = await userRequired();
  if (!isAdminUser(user))
    throw new ApiError(403, "Chỉ quản trị viên được thực hiện.");
  return user;
}
const rateSchema = new Schema({
  _id: String,
  count: Number,
  expiresAt: { type: Date, expires: 0 },
});
const Rate =
  mongoose.models.RequestLimit || mongoose.model("RequestLimit", rateSchema);
export async function rateLimit(key: string, limit: number, windowMs = 60000) {
  await dbConnect();
  const bucket = Math.floor(Date.now() / windowMs);
  const _id = createHash("sha256")
    .update(key + ":" + bucket)
    .digest("hex");
  let row;
  try {
    row = await Rate.findOneAndUpdate(
      { _id },
      {
        $inc: { count: 1 },
        $setOnInsert: { expiresAt: new Date((bucket + 2) * windowMs) },
      },
      { upsert: true, new: true },
    );
  } catch (e) {
    if ((e as { code?: number }).code !== 11000) throw e;
    row = await Rate.findOneAndUpdate(
      { _id },
      { $inc: { count: 1 } },
      { new: true },
    );
  }
  if (!row || row.count > limit)
    throw new ApiError(429, "Bạn thao tác quá nhanh. Vui lòng thử lại sau.");
}
export function stringValue(value: unknown, min = 1, max = 200): string {
  if (
    typeof value !== "string" ||
    value.trim().length < min ||
    value.length > max
  )
    throw new ApiError(400, "Thông tin văn bản không hợp lệ.");
  return value.trim();
}
export function integer(value: unknown, min: number, max: number): number {
  if (
    typeof value !== "number" ||
    !Number.isSafeInteger(value) ||
    value < min ||
    value > max
  )
    throw new ApiError(400, "Giá hoặc số lượng không hợp lệ.");
  return value;
}
