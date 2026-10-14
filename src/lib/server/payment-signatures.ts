import { createHmac, timingSafeEqual } from "node:crypto";
export function signFields(
  fields: Record<string, string | number>,
  key: string,
) {
  const raw = Object.keys(fields)
    .sort()
    .map((k) => `${k}=${fields[k]}`)
    .join("&");
  return createHmac("sha256", key).update(raw).digest("hex");
}
export function equalSignature(actual: unknown, expected: string) {
  return (
    typeof actual === "string" &&
    /^[a-f\d]{64}$/i.test(actual) &&
    timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(expected, "hex"))
  );
}
export function verifyMomo(
  data: Record<string, unknown>,
  accessKey: string,
  key: string,
  partnerCode: string,
) {
  const keys = [
    "amount",
    "extraData",
    "message",
    "orderId",
    "orderInfo",
    "orderType",
    "partnerCode",
    "payType",
    "requestId",
    "responseTime",
    "resultCode",
    "transId",
  ];
  const fields: Record<string, string | number> = { accessKey };
  for (const field of keys) {
    const value = data[field] ?? (field === "extraData" ? "" : undefined);
    if (typeof value !== "string" && typeof value !== "number") return false;
    fields[field] = value;
  }
  return (
    data.partnerCode === partnerCode &&
    equalSignature(data.signature, signFields(fields, key))
  );
}
export function trustedCheckoutUrl(value: unknown, provider: string): string {
  if (typeof value !== "string") throw new Error("Missing payment URL");
  const url = new URL(value);
  const hosts =
    provider === "momo"
      ? ["payment.momo.vn", "test-payment.momo.vn"]
      : ["pay.payos.vn"];
  if (
    url.protocol !== "https:" ||
    !hosts.includes(url.hostname) ||
    url.username ||
    url.password
  )
    throw new Error("Unexpected payment URL");
  return url.toString();
}
