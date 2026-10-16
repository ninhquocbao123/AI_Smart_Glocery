import { PayOS } from "@payos/node";
import { ApiError } from "./http";
import { appUrl, paymentReady, secret } from "./config";
import { signFields, trustedCheckoutUrl } from "./payment-signatures";

export function payosClient() {
  return new PayOS({
    clientId: secret("PAYOS_CLIENT_ID"),
    apiKey: secret("PAYOS_API_KEY"),
    checksumKey: secret("PAYOS_CHECKSUM_KEY"),
    baseURL: "https://api-merchant.payos.vn",
    timeout: 30000,
    maxRetries: 0,
  });
}
export interface PaymentOrder {
  orderId: string;
  total: number;
  paymentMethod: string;
  payment: {
    reference: string;
    requestId: string;
    orderCode: number;
    environment: string;
  };
}
function checkEnvironment(order: PaymentOrder) {
  const environment =
    order.paymentMethod === "momo" && process.env.MOMO_ENV !== "production"
      ? "sandbox"
      : "production";
  if (order.payment.environment !== environment)
    throw new ApiError(
      409,
      "Đơn thuộc môi trường thanh toán khác. Vui lòng liên hệ hỗ trợ.",
    );
}
function momoBase() {
  return process.env.MOMO_ENV === "production"
    ? "https://payment.momo.vn"
    : "https://test-payment.momo.vn";
}
async function momoPost(path: string, data: object) {
  const response = await fetch(momoBase() + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    cache: "no-store",
    signal: AbortSignal.timeout(35000),
  });
  if (!response.ok)
    throw new ApiError(
      502,
      "MoMo tạm thời không phản hồi. Hãy kiểm tra trạng thái trước khi thử lại.",
    );
  return response.json();
}
export async function createPayment(order: PaymentOrder) {
  checkEnvironment(order);
  if (!paymentReady(order.paymentMethod))
    throw new ApiError(503, "Phương thức thanh toán chưa được cấu hình.");
  const returnUrl = appUrl() + "/orders?paymentOrder=" + encodeURIComponent(order.orderId);
  if (order.paymentMethod === "momo") {
    const fields = {
      accessKey: secret("MOMO_ACCESS_KEY"),
      amount: order.total,
      extraData: "",
      ipnUrl: appUrl() + "/api/payments/momo/webhook",
      orderId: order.payment.reference,
      orderInfo: "Smart Grocery " + order.orderId,
      partnerCode: secret("MOMO_PARTNER_CODE"),
      redirectUrl: returnUrl,
      requestId: order.payment.requestId,
      requestType: "captureWallet",
    };
    const result = await momoPost("/v2/gateway/api/create", {
      ...fields,
      signature: signFields(fields, secret("MOMO_SECRET_KEY")),
      autoCapture: true,
      lang: "vi",
    });
    if (
      result.resultCode !== 0 ||
      result.partnerCode !== fields.partnerCode ||
      result.orderId !== fields.orderId ||
      result.requestId !== fields.requestId ||
      Number(result.amount) !== order.total
    )
      throw new ApiError(
        502,
        "MoMo chưa tạo được phiên. Hãy kiểm tra trạng thái đơn trước khi thử lại.",
      );
    return trustedCheckoutUrl(result.payUrl, "momo");
  }
  return (await createBankPayment(order)).checkoutUrl;
}
export async function createBankPayment(order: PaymentOrder) {
  checkEnvironment(order);
  if (order.paymentMethod !== "bank" || !paymentReady("bank"))
    throw new ApiError(409, "Thanh toán ngân hàng chưa sẵn sàng.");
  const returnUrl = appUrl() + "/payment/" + encodeURIComponent(order.orderId);
  const expiresAt = Math.floor(Date.now() / 1000) + 1800;
  const result = await payosClient().paymentRequests.create({
    orderCode: order.payment.orderCode,
    amount: order.total,
    description: "SG" + String(order.payment.orderCode).slice(-7),
    returnUrl,
    cancelUrl: returnUrl,
    expiredAt: expiresAt,
  });
  if (
    result.orderCode !== order.payment.orderCode ||
    result.amount !== order.total
  )
    throw new ApiError(502, "Thông tin thanh toán ngân hàng không khớp.");
  if (!result.qrCode || !result.accountNumber || !result.accountName || result.currency !== "VND")
    throw new ApiError(502, "payOS chưa trả đủ thông tin mã QR.");
  return {
    checkoutUrl: trustedCheckoutUrl(result.checkoutUrl, "bank"),
    qrCode: result.qrCode, accountNumber: result.accountNumber,
    accountName: result.accountName, bankBin: result.bin,
    description: result.description, expiresAt,
  };
}
export async function queryPayment(order: PaymentOrder) {
  checkEnvironment(order);
  if (order.paymentMethod === "momo") {
    const fields = {
      accessKey: secret("MOMO_ACCESS_KEY"),
      orderId: order.payment.reference,
      partnerCode: secret("MOMO_PARTNER_CODE"),
      requestId: order.payment.requestId,
    };
    const data = await momoPost("/v2/gateway/api/query", {
      ...fields,
      signature: signFields(fields, secret("MOMO_SECRET_KEY")),
      lang: "vi",
    });
    if (
      data.orderId !== fields.orderId ||
      data.partnerCode !== fields.partnerCode
    )
      throw new ApiError(502, "Kết quả đối soát không khớp.");
    return {
      paid: data.resultCode === 0,
      amount: Number(data.amount),
      transactionId: String(data.transId ?? ""),
    };
  }
  const data = await payosClient().paymentRequests.get(order.payment.orderCode);
  if (data.orderCode !== order.payment.orderCode)
    throw new ApiError(502, "Kết quả đối soát không khớp.");
  return {
    paid: data.status === "PAID" && data.amountPaid >= data.amount,
    status: data.status,
    amount: data.amount,
    transactionId: data.id,
  };
}
