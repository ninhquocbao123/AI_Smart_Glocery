import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import User from "@/models/User";
import { Membership, MemberAudit } from "@/models/Membership";
import {
  adminRequired,
  body,
  fail,
  sameOrigin,
  stringValue,
  ApiError,
} from "@/lib/server/http";
import { member } from "@/lib/server/membership";
import {
  grantMembership,
  revokeMembership,
} from "@/lib/server/membership-grants";
export async function GET(req: Request) {
  try {
    await adminRequired();
    const q = new URL(req.url).searchParams;
    const page = Number(q.get("page") ?? 1);
    if (!Number.isSafeInteger(page) || page < 1 || page > 100000)
      throw new ApiError(400, "Trang không hợp lệ.");
    const search = (q.get("q") ?? "")
      .slice(0, 100)
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter: Record<string, unknown> = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};
    const plan = q.get("plan");
    if (plan && ["free", "vip", "plus"].includes(plan)) {
      const ids = await Membership.distinct("userId", {
        startsAt: { $lte: new Date() },
        endsAt: { $gt: new Date() },
        revokedAt: null,
        ...(plan === "free" ? {} : { plan }),
      });
      filter._id = plan === "free" ? { $nin: ids } : { $in: ids };
    }
    const [users, total] = await Promise.all([
      User.find(filter)
        .select("name email phone createdAt")
        .sort({ createdAt: -1 })
        .skip((page - 1) * 20)
        .limit(20),
      User.countDocuments(filter),
    ]);
    const result = await Promise.all(
      users.map(async (u) => ({
        ...u.toObject(),
        membership: await member(String(u._id)),
      })),
    );
    const id = q.get("id");
    const selectedUser = id && mongoose.isValidObjectId(id)
      ? await User.findById(id).select("name email phone createdAt")
      : null;
    return Response.json({
      users: result,
      total,
      page,
      ...(selectedUser ? { selectedUser: { ...selectedUser.toObject(), membership: await member(String(selectedUser._id)) } } : {}),
      ...(id && mongoose.isValidObjectId(id)
        ? {
            history: await Membership.find({ userId: id }).sort({
              createdAt: -1,
            }),
            audit: await MemberAudit.find({ userId: id })
              .sort({ createdAt: -1 })
              .limit(50),
          }
        : {}),
    });
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const admin = await adminRequired();
    const d = await body(req);
    const id = stringValue(d.userId),
      reason = stringValue(d.reason, 5, 500);
    if (!mongoose.isValidObjectId(id) || !(await User.exists({ _id: id })))
      throw new ApiError(404, "Không tìm thấy người dùng.");
    if (d.action === "revoke")
      await revokeMembership(id, String(admin._id), reason);
    else {
      if (d.plan !== "vip" && d.plan !== "plus")
        throw new ApiError(400, "Gói không hợp lệ.");
      await grantMembership(
        id,
        d.plan,
        "admin:" + randomUUID(),
        "admin",
        String(admin._id),
        reason,
      );
    }
    return Response.json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
