import { ApiError } from "./http";
export const isLive = () => process.env.COMMERCE_MODE === "live";
export function secret(name: string) {
  const value = process.env[name]?.trim();
  if (!value)
    throw new ApiError(
      503,
      "Dịch vụ chưa được cấu hình. Vui lòng liên hệ quản trị viên.",
    );
  return value;
}
export function appUrl() {
  const url = new URL(secret("APP_URL"));
  if (
    url.protocol !== "https:" &&
    !(process.env.NODE_ENV !== "production" && url.hostname === "localhost")
  )
    throw new ApiError(503, "APP_URL cần HTTPS.");
  return url.origin;
}
export function paymentReady(method: string) {
  if (method === "cod") return true;
  if (method === "momo")
    return (
      !!(
        process.env.MOMO_PARTNER_CODE &&
        process.env.MOMO_ACCESS_KEY &&
        process.env.MOMO_SECRET_KEY &&
        process.env.APP_URL
      ) &&
      (process.env.MOMO_ENV !== "production" ||
        process.env.LIVE_PAYMENTS_ENABLED === "true")
    );
  if (method === "bank")
    return (
      process.env.LIVE_PAYMENTS_ENABLED === "true" &&
      !!(
        process.env.PAYOS_CLIENT_ID &&
        process.env.PAYOS_API_KEY &&
        process.env.PAYOS_CHECKSUM_KEY &&
        process.env.APP_URL
      )
    );
  return false;
}
