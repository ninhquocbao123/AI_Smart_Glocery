import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { createHmac, createHash } from "node:crypto";
const require = createRequire(import.meta.url),
  ts = require("typescript");
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const http = {
  ApiError,
  stringValue(value, min = 1, max = 200) {
    if (
      typeof value !== "string" ||
      value.trim().length < min ||
      value.length > max
    )
      throw new ApiError(400, "invalid");
    return value.trim();
  },
  integer(value, min, max) {
    if (!Number.isSafeInteger(value) || value < min || value > max)
      throw new ApiError(400, "invalid");
    return value;
  },
};
function loader(stubs = {}, env = {}) {
  const cache = new Map();
  function load(file) {
    file = path.resolve(file);
    if (cache.has(file)) return cache.get(file);
    const exports = {};
    cache.set(file, exports);
    const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        esModuleInterop: true,
      },
    }).outputText;
    const resolve = (id) =>
      id.startsWith("@/")
        ? path.resolve("src", id.slice(2) + ".ts")
        : id.startsWith(".")
          ? path.resolve(path.dirname(file), id + ".ts")
          : null;
    vm.runInNewContext(source, {
      exports,
      require: (id) =>
        Object.hasOwn(stubs, id)
          ? stubs[id]
          : resolve(id) && Object.hasOwn(stubs, resolve(id))
            ? stubs[resolve(id)]
            : resolve(id)
              ? load(resolve(id))
              : require(id),
      Buffer,
      Date,
      URL,
      Number,
      Set,
      Map,
      Response,
      Request,
      AbortSignal,
      process: { env },
      fetch: stubs.fetch ?? fetch,
    });
    return exports;
  }
  return load;
}
const load = loader();
test("demo payment and delivery run end-to-end, while live simulation is rejected", async()=>{
  const record={orderId:"demo-order",userId:"demo-user",mode:"demo",status:"unpaid",paymentStatus:"pending"};
  const common={...http,sameOrigin:()=>{},userRequired:async()=>({_id:"demo-user"}),body:req=>req.json(),fail:e=>Response.json({message:e.message},{status:e.status??503})};
  let writes=0;
  const model={findOneAndUpdate:async(filter,update)=>{
    assert.equal(filter.mode,"demo");assert.equal(filter.userId,"demo-user");
    if(!filter.status.$in.includes(record.status))return null;
    writes++;Object.assign(record,update.$set);return record;
  }};
  const stubs={"@/lib/server/http":common,"./http":common,"@/models/Order":{__esModule:true,default:model},"@/lib/server/order-service":{}};
  const route=loader(stubs,{COMMERCE_MODE:"demo"})("src/app/api/orders/route.ts");
  for(const [action,status] of [["demoPay","confirmed"],["demoShip","delivering"],["demoReceive","completed"]]){
    const response=await route.PATCH(new Request("http://localhost/api/orders",{method:"PATCH",body:JSON.stringify({id:"demo-order",action})}));
    assert.equal(response.status,200);assert.equal((await response.json()).order.status,status);
  }
  const live=loader(stubs,{COMMERCE_MODE:"live"})("src/app/api/orders/route.ts");
  const denied=await live.PATCH(new Request("http://localhost/api/orders",{method:"PATCH",body:JSON.stringify({id:"demo-order",action:"demoPay"})}));
  assert.equal(denied.status,403);assert.equal(writes,3);
});
const { signFields, verifyMomo, equalSignature, trustedCheckoutUrl } = load(
  "src/lib/server/payment-signatures.ts",
);
test("MoMo IPN verifies a signed fixture and rejects modified amount/partner/signature", () => {
  const data = {
    amount: 50000,
    extraData: "",
    message: "Successful.",
    orderId: "SG-fixture",
    orderInfo: "Test",
    orderType: "momo_wallet",
    partnerCode: "PARTNER",
    payType: "qr",
    requestId: "request",
    responseTime: 123,
    resultCode: 0,
    transId: 456,
  };
  const raw =
    "accessKey=ACCESS&amount=50000&extraData=&message=Successful.&orderId=SG-fixture&orderInfo=Test&orderType=momo_wallet&partnerCode=PARTNER&payType=qr&requestId=request&responseTime=123&resultCode=0&transId=456";
  data.signature = createHmac("sha256", "SECRET").update(raw).digest("hex");
  assert.equal(verifyMomo(data, "ACCESS", "SECRET", "PARTNER"), true);
  assert.equal(
    verifyMomo({ ...data, amount: 1 }, "ACCESS", "SECRET", "PARTNER"),
    false,
  );
  assert.equal(verifyMomo(data, "ACCESS", "SECRET", "OTHER"), false);
  assert.equal(equalSignature("not-hex", data.signature), false);
  assert.equal(
    signFields({ b: 2, a: 1 }, "key"),
    createHmac("sha256", "key").update("a=1&b=2").digest("hex"),
  );
});
test("checkout redirects cannot leave official payment hosts", () => {
  assert.ok(trustedCheckoutUrl("https://pay.payos.vn/web/123", "bank"));
  for (const url of [
    "javascript:alert(1)",
    "https://pay.payos.vn.evil.test",
    "http://payment.momo.vn",
    "https://evil.test",
  ])
    assert.throws(() => trustedCheckoutUrl(url, "momo"));
});
test("AI output must contain only unique eligible recipe IDs", () => {
  const { validateRanking } = load("src/lib/ai-result.ts");
  assert.deepEqual(
    [...validateRanking({ recipeIds: ["b", "a"] }, ["a", "b"])],
    ["b", "a"],
  );
  for (const recipeIds of [["unknown"], ["a", "a"], [], [null]])
    assert.throws(() => validateRanking({ recipeIds }, ["a"]));
});
const catalogStubs = {
  "./catalog-data": { readCatalog: async () => { const data = loader()("src/data/mockData.ts"); return { recipes: data.recipes, deals: data.DEALS_DATA }; } },
  "./http": http,
  "@/lib/mongodb": { __esModule: true, default: async () => {} },
  "@/models/Commerce": { Offer: {}, RetailStore: {} },
};
test("server quotes ignore client prices and merge duplicate ingredient quantities", async () => {
  const local = loader(catalogStubs),
    { parseCart, quoteCart } = local("src/lib/server/quote.ts");
  const { recipes } = local("src/data/mockData.ts"),
    r = recipes[0],
    i = r.ingredients[0];
  const rows = [
    { ingredient: { ...i, price: 1 }, quantity: 2, recipeId: r.id },
    { ingredient: { ...i, price: 999999 }, quantity: 3, recipeId: r.id },
  ];
  assert.equal(parseCart(rows)[0].quantity, 5);
  const quote = await quoteCart(rows, i.store);
  assert.equal(quote.items.length, 1);
  assert.equal(quote.items[0].ingredient.price, i.price);
  assert.equal(quote.total, i.price * 5 + quote.deliveryFee);
  for (const q of [0, -1, NaN, 1.5, 100001])
    assert.throws(() => parseCart([{ ...rows[0], quantity: q }]));
  await assert.rejects(() => quoteCart(rows, "Unknown store"));
});
test("live checkout fails closed when no store has accepted fulfillment", async () => {
  const local = loader(
    {
      ...catalogStubs,
      "@/models/Commerce": {
        RetailStore: { findOne: () => ({ session: async () => null }) },
        Offer: {},
      },
    },
    { COMMERCE_MODE: "live" },
  );
  await assert.rejects(
    () =>
      local("src/lib/server/quote.ts").quoteCart(
        [{ id: "x", quantity: 1, recipeId: "r" }],
        "Winmart",
      ),
    (e) => e.status === 409,
  );
});
test("settlement checks amount before update and repeated paid notifications do not update again", async () => {
  let writes = 0;
  const record = {
    _id: "db",
    total: 50000,
    paymentStatus: "pending",
    status: "unpaid",
  };
  const order = {
    findOne: async () => record,
    findOneAndUpdate: async (filter, update) => {
      writes++;
      assert.ok(filter.paymentStatus.$nin.includes("paid"));
      assert.ok(Array.isArray(update));
      record.paymentStatus = "paid";
      return record;
    },
  };
  const local = loader({
    ...catalogStubs,
    "@/models/Order": { __esModule: true, default: order },
  });
  const { settlePayment } = local("src/lib/server/order-service.ts");
  await assert.rejects(
    () => settlePayment("SG", "bank", 1000, "tx"),
    (e) => e.status === 400,
  );
  assert.equal(writes, 0);
  await settlePayment("SG", "bank", 50000, "tx");
  await settlePayment("SG", "bank", 50000, "tx");
  assert.equal(writes, 1);
});
test("order replay returns the existing order and rejects reuse with changed payload", async () => {
  const record = { orderId: "existing", requestHash: "wrong" };
  const local = loader({
    ...catalogStubs,
    "@/models/Order": {
      __esModule: true,
      default: { findOne: async () => record },
    },
  });
  const { placeOrder, validateCheckout } = local(
    "src/lib/server/order-service.ts",
  );
  const data = {
    items: [{ id: "i-001-1", recipeId: "recipe-001", quantity: 1 }],
    store: "Winmart",
    address: "Địa chỉ thử nghiệm",
    phone: "0900000000",
    paymentMethod: "cod",
    expectedTotal: 15000,
    clientRequestId: "fixture-request-id",
  };
  assert.equal(validateCheckout(data).phone, "0900000000");
  await assert.rejects(
    () => placeOrder("user", data),
    (e) => e.status === 409,
  );
  record.requestHash = createHash("sha256")
    .update(JSON.stringify(validateCheckout(data)))
    .digest("hex");
  assert.equal((await placeOrder("user", data)).orderId, "existing");
  assert.throws(() => validateCheckout({ ...data, expectedTotal: -1 }));
});
