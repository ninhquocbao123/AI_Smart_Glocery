export type Plan = "free" | "vip" | "plus";
export const PLANS = {
  free: { name: "Miễn phí", price: 0, chat: 3, generations: 1, days: 1 },
  vip: { name: "VIP", price: 19000, chat: 25, generations: 5, days: 3 },
  plus: { name: "VIP Plus", price: 39000, chat: 50, generations: 15, days: 7 },
};
export const DAY = 86400000;
export function vietnamPeriods(now = new Date()) {
  const local = new Date(now.getTime() + 7 * 3600000);
  const midnight =
    Date.UTC(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate()) -
    7 * 3600000;
  const monday = midnight - ((local.getUTCDay() + 6) % 7) * DAY;
  return {
    day: midnight,
    week: monday,
    nextDay: midnight + DAY,
    nextWeek: monday + 7 * DAY,
  };
}
