import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const suffix = Date.now();
assert.equal((await (await fetch(base + "/api/stores")).json()).mode, "demo", "Integration test only runs in demo mode; it never initiates a real payment.");
const email = `grocery-test-${suffix}@example.test`;
const password = "DemoTest-Only-2026!";
async function call(path, method = "GET", body, cookie = "") {
  const response = await fetch(base + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return {
    status: response.status,
    data: await response.json(),
    cookie: response.headers.get("set-cookie")?.split(";")[0],
  };
}
assert.equal((await call("/api/orders")).status, 401);
assert.equal((await call("/api/budget")).status, 401);
assert.equal(
  (
    await call("/api/auth/register", "POST", {
      name: "Test",
      email,
      password: "short",
    })
  ).status,
  400,
);
assert.equal(
  (
    await call("/api/auth/register", "POST", {
      name: "Kiểm thử demo",
      email: email.toUpperCase(),
      password,
    })
  ).status,
  201,
);
assert.equal(
  (
    await call("/api/auth/register", "POST", {
      name: "Duplicate",
      email,
      password,
    })
  ).status,
  409,
);
assert.equal(
  (await call("/api/auth/login", "POST", { email, password: "wrong-password" }))
    .status,
  401,
);
const login = await call("/api/auth/login", "POST", { email, password });
assert.equal(login.status, 200);
assert.ok(login.cookie);
const cookie = login.cookie;
assert.equal(
  (await call("/api/auth/session", "GET", undefined, cookie)).data.user.email,
  email,
);
const profile = await call(
  "/api/profile",
  "PATCH",
  {
    name: "Demo đã cập nhật",
    phone: "0900000000",
    address: "Địa chỉ thử nghiệm, không giao thật",
    diet: "Không hạn chế",
    allergies: [],
    monthlyBudgetTarget: 2000000,
  },
  cookie,
);
assert.equal(profile.status, 200);
assert.equal(profile.data.user.monthlyBudgetTarget, 2000000);
assert.equal(profile.data.user.password, undefined);
const request = {
  items: [
    { ingredient: { id: "deal-001", price: 1 }, quantity: 2, recipeId: "deal" },
  ],
  store: "Winmart",
  address: "Địa chỉ thử nghiệm, không giao thật",
  paymentMethod: "demo",
  phone: "0900000000",
  clientRequestId: `integration-${suffix}`,
  expectedTotal: 205000,
  total: 1,
  userId: "another-user",
};
const created = await call("/api/orders", "POST", request, cookie);
assert.equal(created.status, 201, JSON.stringify(created.data));
assert.equal(created.data.order.total, 205000);
assert.equal(created.data.order.status, "unpaid");
assert.equal(created.data.order.userId, login.data.user.id);
const id = created.data.order.orderId;
assert.equal((await call("/api/orders", "POST", request, cookie)).data.order.orderId, id);
assert.equal((await call("/api/admin/catalog", "GET", undefined, cookie)).status, 403);
assert.equal((await call("/api/payments", "POST", { orderId: id }, cookie)).status, 409);
assert.equal(
  (await call("/api/budget", "GET", undefined, cookie)).data.orders.length,
  0,
);
assert.equal(
  (
    await call(
      "/api/orders",
      "POST",
      { ...request, items: [{ ...request.items[0], quantity: -1 }] },
      cookie,
    )
  ).status,
  400,
);
assert.equal(
  (await call("/api/orders", "PATCH", { id, action: "receive" }, cookie))
    .status,
  409,
);
assert.equal(
  (await call("/api/orders", "PATCH", { id, action: "demoPay" }, cookie)).status,
  200,
);
const cancelled = await call("/api/orders", "POST", {...request,clientRequestId:`integration-cancel-${suffix}`}, cookie);
assert.equal((await call("/api/orders", "PATCH", {id,action:"demoShip"}, cookie)).data.order.status,"delivering");
assert.equal((await call("/api/orders", "PATCH", {id,action:"demoReceive"}, cookie)).data.order.status,"completed");
assert.equal((await call("/api/budget", "GET", undefined, cookie)).data.orders[0].total,205000);
assert.equal(
  (
    await call(
      "/api/orders",
      "PATCH",
      { id: cancelled.data.order.orderId, action: "cancel" },
      cookie,
    )
  ).data.order.status,
  "cancelled",
);
const otherEmail = `grocery-test-other-${suffix}@example.test`;
await call("/api/auth/register", "POST", {
  name: "Tài khoản độc lập",
  email: otherEmail,
  password,
});
const other = await call("/api/auth/login", "POST", {
  email: otherEmail,
  password,
});
assert.equal(
  (
    await call(
      "/api/orders?userId=" + login.data.user.id,
      "GET",
      undefined,
      other.cookie,
    )
  ).data.orders.length,
  0,
);
assert.equal(
  (await call("/api/orders", "PATCH", { id, action: "receive" }, other.cookie))
    .status,
  409,
);
assert.equal(
  (await call("/api/auth/session", "DELETE", undefined, cookie)).status,
  200,
);
assert.equal((await call("/api/orders", "GET", undefined, cookie)).status, 401);
console.log(
  "PASS: registration, session, profile, server pricing, idempotency, demo payment/delivery/budget, cancellation, admin isolation, external-payment refusal, ownership isolation and logout.",
);
console.log("Temporary QA account: " + email);
console.log("Temporary secondary QA account: " + otherEmail);
