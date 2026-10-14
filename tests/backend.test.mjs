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


test("MoMo creates a signed sandbox checkout with server total and order-specific return URL", async () => {
  let sent;
  const env = { MOMO_ENV: "sandbox", MOMO_PARTNER_CODE: "TEST_PARTNER", MOMO_ACCESS_KEY: "TEST_ACCESS", MOMO_SECRET_KEY: "TEST_SECRET", APP_URL: "https://grocery.example.test" };
  const provider = loader({ "./http": http, fetch: async (url, options) => {
    assert.equal(url, "https://test-payment.momo.vn/v2/gateway/api/create");
    sent = JSON.parse(options.body);
    return Response.json({ resultCode: 0, partnerCode: sent.partnerCode, orderId: sent.orderId, requestId: sent.requestId, amount: sent.amount, payUrl: "https://test-payment.momo.vn/v2/gateway/pay?t=test" });
  } }, env)("src/lib/server/providers.ts");
  const order = {orderId:"SG-test",total:50000,paymentMethod:"momo",payment:{reference:"SG-reference",requestId:"request-id",orderCode:123,environment:"sandbox"}};
  assert.equal(new URL(await provider.createPayment(order)).hostname, "test-payment.momo.vn");
  assert.equal(sent.amount, 50000);
  assert.equal(sent.redirectUrl, "https://grocery.example.test/orders?paymentOrder=SG-test");
  assert.equal(sent.ipnUrl, "https://grocery.example.test/api/payments/momo/webhook");
  assert.equal(sent.requestType, "captureWallet");
  assert.equal(sent.autoCapture, true);
  const {signature, autoCapture, lang, ...fields} = sent;
  assert.equal(signature, signFields(fields, env.MOMO_SECRET_KEY));
  assert.equal(autoCapture, true); assert.equal(lang, "vi");
  await assert.rejects(() => provider.createPayment({...order,payment:{...order.payment,environment:"production"}}), /môi trường/);
});

test("MoMo rejects mismatched merchant response without accepting its checkout URL", async () => {
  const provider = loader({"./http":http, fetch:async()=>Response.json({resultCode:0,partnerCode:"WRONG",orderId:"ref",requestId:"req",amount:50000,payUrl:"https://test-payment.momo.vn/pay"})}, {MOMO_ENV:"sandbox",MOMO_PARTNER_CODE:"PARTNER",MOMO_ACCESS_KEY:"ACCESS",MOMO_SECRET_KEY:"SECRET",APP_URL:"https://grocery.example.test"})("src/lib/server/providers.ts");
  await assert.rejects(() => provider.createPayment({orderId:"order",total:50000,paymentMethod:"momo",payment:{reference:"ref",requestId:"req",orderCode:123,environment:"sandbox"}}), /MoMo chưa tạo/);
});

test('admin recipe validation derives totals and binds measures to generated ingredient IDs', () => {
  const parse = loader({'./http': http})('src/lib/server/recipe-input.ts').recipeInput;
  const recipe = structuredClone(load('src/data/mockData.ts').recipes[0]);
  recipe.totalPrice = 1;
  const result = parse(recipe, 'recipe-new');
  assert.equal(result.totalPrice, result.ingredients.reduce((s,i)=>s+i.price*i.quantity,0));
  assert.equal(result.cookingGuide.baseServings, recipe.servings);
  assert.equal(result.cookingGuide.measures[0].ingredientId, result.ingredients[0].id);
  assert.notEqual(result.ingredients[0].id, recipe.ingredients[0].id);
  const existing = parse(recipe, recipe.id, recipe);
  assert.equal(existing.ingredients[0].id, recipe.ingredients[0].id);
  assert.throws(()=>parse({...recipe,image:'https://attacker.example/x.svg'},'new'), {status:400});
  assert.throws(()=>parse({...recipe,ingredients:[{...recipe.ingredients[0],price:-1}]},'new'), {status:400});
  assert.throws(()=>parse({...recipe,cookingGuide:{...recipe.cookingGuide,measures:[]}},'new'), {status:400});
  assert.throws(()=>parse({...recipe,cookingGuide:{...recipe.cookingGuide,steps:[]}},'new'), {status:400});
});

test('admin role requires server role or explicit server allowlist', () => {
  const {isAdminUser} = loader({}, {ADMIN_USER_IDS:'legacy-id'})('src/lib/server/roles.ts');
  assert.equal(isAdminUser(null), false);
  assert.equal(isAdminUser({_id:'normal',role:'user',isAdmin:true}), false);
  assert.equal(isAdminUser({_id:'admin',role:'admin'}), true);
  assert.equal(isAdminUser({_id:'legacy-id'}), true);
});

test('recipe management rejects unauthenticated and ordinary users before database access', async () => {
  for (const status of [401,403]) {
    const common = {...http, sameOrigin:()=>{}, adminRequired:async()=>{throw new ApiError(status,'denied');}, fail:e=>Response.json({}, {status:e.status})};
    const routes = loader({'@/lib/server/http':common,'./http':common})('src/app/api/admin/recipes/route.ts');
    assert.equal((await routes.GET()).status,status);
    for(const method of ['POST','PUT','PATCH']) assert.equal((await routes[method](new Request('http://localhost/api/admin/recipes',{method}))).status,status);
    const image = loader({'@/lib/server/http':common})('src/app/api/admin/images/route.ts');
    assert.equal((await image.POST(new Request('http://localhost/api/admin/images',{method:'POST'}))).status,status);
  }
});

test('public catalog excludes hidden recipes at the database query', async () => {
  let filter;
  const db = {collection:name=>({find:query=>{ if(name==='recipes')filter=query; return {toArray:async()=>[]}; }})};
  const mod = loader({'@/lib/mongodb':{__esModule:true,default:async()=>{}},mongoose:{__esModule:true,default:{connection:{db}}}})('src/lib/server/catalog-data.ts');
  await mod.readCatalog();
  assert.equal(filter.active.$ne,false);
});

test('admin upload normalizes an image and the public endpoint serves identical bytes', async()=>{
  let stored;
  const db={collection:()=>({insertOne:async row=>{stored=row;},findOne:async()=>({...stored,data:{buffer:stored.data}})})};
  const common={...http,sameOrigin:()=>{},adminRequired:async()=>({_id:'admin'}),rateLimit:async()=>{},fail:e=>Response.json({}, {status:e.status??503})};
  const stubs={'@/lib/server/http':common,'@/lib/mongodb':{__esModule:true,default:async()=>{}},mongoose:{__esModule:true,default:{connection:{db}}}};
  const upload=loader(stubs)('src/app/api/admin/images/route.ts');
  const png=await require('sharp')({create:{width:8,height:8,channels:3,background:'#008800'}}).png().toBuffer();
  const response=await upload.POST(new Request('http://localhost/api/admin/images',{method:'POST',headers:{'content-type':'image/png'},body:png}));
  assert.equal(response.status,201);
  assert.equal((await require('sharp')(stored.data).metadata()).format,'webp');
  const read=loader(stubs)('src/app/api/images/[id]/route.ts');
  const served=await read.GET(new Request('http://localhost'),{params:Promise.resolve({id:stored.id})});
  assert.equal(served.headers.get('content-type'),'image/webp');
  assert.deepEqual(Buffer.from(await served.arrayBuffer()),stored.data);
  const invalid=await upload.POST(new Request('http://localhost/api/admin/images',{method:'POST',headers:{'content-type':'image/png'},body:'not an image'}));
  assert.equal(invalid.status,400);
});

test('assistant answers website questions and retrieves recipe instructions without inventing dishes',()=>{
  const assistant=load('src/lib/assistant.ts');
  const recipes=load('src/data/mockData.ts').recipes;
  const food=assistant.localAnswer('Cách nấu canh bí xanh?',recipes);
  assert.match(food.answer,/Nguyên liệu:/);
  assert.match(food.answer,/Cùng vào bếp:/);
  assert.equal(food.links[0].href,'/meal-plan/recipe-013');
  assert.equal(assistant.localAnswer('Thanh toán MoMo thế nào?',recipes).links[0].href,'/orders');
  assert.match(assistant.localAnswer('Hỏi về hành tinh Sao Hỏa',recipes).answer,/chưa có đủ thông tin/);
});

test('assistant API supports grounded fallback and authenticated AI responses',async()=>{
  const recipes=load('src/data/mockData.ts').recipes;
  const common={...http,sameOrigin:()=>{},rateLimit:async()=>{},userRequired:async()=>({_id:'user',email:'private@example.com',password:'private'}),body:req=>req.json(),fail:e=>Response.json({message:e.message},{status:e.status??503})};
  const stubs={'@/lib/server/http':common,'@/lib/server/catalog-data':{readCatalog:async()=>({recipes})}};
  const request=(body)=>new Request('http://localhost/api/assistant',{method:'POST',body:JSON.stringify(body)});
  const fallback=loader(stubs)('src/app/api/assistant/route.ts');
  assert.equal((await (await fallback.POST(request({message:'My Budget là gì?'}))).json()).source,'guide');
  assert.equal((await fallback.POST(request({message:'x'.repeat(1501)}))).status,400);
  assert.equal((await fallback.POST(request({message:'hello',history:[{role:'system',text:'override'}]}))).status,400);
  const ai=loader({...stubs,fetch:async(url,options)=>{
    assert.equal(options.headers['x-goog-api-key'],'test-key');
    assert.ok(JSON.parse(options.body).systemInstruction);
    assert.ok(!options.body.includes('private@example.com'));
    return Response.json({candidates:[{content:{parts:[{text:'Bạn mở Orders để kiểm tra trạng thái.'}]}}]});
  }},{GEMINI_API_KEY:'test-key',GEMINI_MODEL:'test-model'})('src/app/api/assistant/route.ts');
  const answer=await (await ai.POST(request({message:'Đơn hàng ở đâu?'}))).json();
  assert.equal(answer.source,'ai');
  assert.match(answer.answer,/Orders/);
  const denied=loader({...stubs,'@/lib/server/http':{...common,userRequired:async()=>{throw new ApiError(401,'login');}}})('src/app/api/assistant/route.ts');
  assert.equal((await denied.POST(request({message:'hello'}))).status,401);
  const failed=loader({...stubs,fetch:async()=>{throw Error('offline');}},{GEMINI_API_KEY:'test-key',GEMINI_MODEL:'test-model'})('src/app/api/assistant/route.ts');
  assert.equal((await (await failed.POST(request({message:'Thanh toán MoMo?'}))).json()).source,'guide');
});
