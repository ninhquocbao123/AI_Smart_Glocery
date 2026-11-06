import mongoose from "mongoose";
import { Membership, MemberAudit } from "@/models/Membership";
import { DAY } from "@/lib/membership";
import { ApiError } from "./http";
import User from "@/models/User";
// Serialize grant changes on the user document; transactions require a replica set.
export async function grantMembership(
  userId: string,
  plan: string,
  reference: string,
  source: string,
  actor = "",
  reason = "",
) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      await User.updateOne(
        { _id: userId },
        { $inc: { membershipVersion: 1 } },
        { session },
      );
      if (await Membership.findOne({ reference }).session(session)) return;
      const latest = await Membership.findOne({
        userId,
        revokedAt: null,
        endsAt: { $gt: new Date() },
      })
        .sort({ endsAt: -1 })
        .session(session);
      const start = latest ? new Date(latest.endsAt) : new Date();
      await Membership.create(
        [
          {
            userId,
            plan,
            reference,
            source,
            actor,
            reason,
            startsAt: start,
            endsAt: new Date(+start + 30 * DAY),
          },
        ],
        { session },
      );
      await MemberAudit.create(
        [{ userId, actor, action: "grant:" + plan, reason }],
        { session },
      );
    });
  } catch (e) {
    if ((e as { code?: number }).code !== 11000) throw e;
  } finally {
    await session.endSession();
  }
}
export async function revokeMembership(
  userId: string,
  actor: string,
  reason: string,
) {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const u = await User.updateOne(
        { _id: userId },
        { $inc: { membershipVersion: 1 } },
        { session },
      );
      if (!u.matchedCount)
        throw new ApiError(404, "Không tìm thấy người dùng.");
      await Membership.updateMany(
        { userId, revokedAt: null, endsAt: { $gt: new Date() } },
        { $set: { revokedAt: new Date() } },
        { session },
      );
      await MemberAudit.create([{ userId, actor, action: "revoke", reason }], {
        session,
      });
    });
  } finally {
    await session.endSession();
  }
}
