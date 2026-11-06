import { Membership, Usage } from "@/models/Membership";
import { DAY, PLANS, vietnamPeriods, type Plan } from "@/lib/membership";
import { ApiError } from "./http";
export async function member(userId: string) {
  const now = new Date();
  const grant = await Membership.findOne({
    userId,
    startsAt: { $lte: now },
    endsAt: { $gt: now },
    revokedAt: null,
  }).sort({ startsAt: -1 });
  const plan: Plan = grant?.plan ?? "free";
  const periods = vietnamPeriods(now);
  const cycle = grant
    ? new Date(grant.startsAt).getTime() +
      Math.floor((+now - new Date(grant.startsAt).getTime()) / (30 * DAY)) *
        30 *
        DAY
    : periods.week;
  const chatKey = `${userId}:chat:${periods.day}`;
  const mealKey = `${userId}:meal:${cycle}`;
  const [chat, meal] = await Promise.all([
    Usage.findById(chatKey),
    Usage.findById(mealKey),
  ]);
  return {
    plan,
    config: PLANS[plan],
    endsAt: grant?.endsAt,
    source: grant?.source,
    chatKey,
    mealKey,
    chatRemaining: Math.max(0, PLANS[plan].chat - (chat?.count ?? 0)),
    mealRemaining: Math.max(0, PLANS[plan].generations - (meal?.count ?? 0)),
    chatReset: periods.nextDay,
    mealReset: grant ? cycle + 30 * DAY : periods.nextWeek,
  };
}
export async function reserve(userId: string, kind: "chat" | "meal") {
  const m = await member(userId),
    key = kind === "chat" ? m.chatKey : m.mealKey,
    limit = kind === "chat" ? m.config.chat : m.config.generations;
  try {
    await Usage.updateOne(
      { _id: key },
      { $setOnInsert: { count: 0 } },
      { upsert: true },
    );
  } catch (e) {
    if ((e as { code?: number }).code !== 11000) throw e;
  }
  const row = await Usage.findOneAndUpdate(
    { _id: key, count: { $lt: limit } },
    { $inc: { count: 1 } },
    { new: true },
  );
  if (!row)
    throw new ApiError(
      429,
      kind === "chat"
        ? "Bạn đã hết lượt AI hôm nay. Xem gói thành viên để nâng cấp."
        : "Bạn đã hết lượt tạo thực đơn trong chu kỳ này.",
    );
  let released = false;
  return {
    membership: m,
    release: async () => {
      if (!released) {
        released = true;
        await Usage.updateOne(
          { _id: key, count: { $gt: 0 } },
          { $inc: { count: -1 } },
        );
      }
    },
  };
}
export async function requirePlan(userId: string, minimum: "vip" | "plus") {
  const m = await member(userId);
  if (m.plan === "free" || (minimum === "plus" && m.plan !== "plus"))
    throw new ApiError(
      403,
      `Tính năng yêu cầu ${minimum === "plus" ? "VIP Plus" : "VIP"}.`,
    );
  return m;
}
