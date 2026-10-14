import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { createRequire } from "node:module";
import test from "node:test";
const require = createRequire(import.meta.url),
  ts = require("typescript"),
  cache = new Map();
function load(path) {
  if (cache.has(path)) return cache.get(path);
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (id) =>
      id === "@/data/mockData" ? load("src/data/mockData.ts") : id === "./priceUtils" ? load("src/lib/priceUtils.ts") : id === "./catalog" ? load("src/lib/catalog.ts") : require(id),
    Intl,
    Date,
  });
  cache.set(path, exports);
  return exports;
}
const { recipes } = load("src/data/mockData.ts");
const { recommend, recipeCost } = load("src/lib/recommendations.ts");
const { monthKey, normalizeOrders, reorderItems, orderDate, orderItemMoney } = load("src/lib/orders.ts");

test("legacy seed orders render names without changing saved totals", () => {
  const raw = { orderId: "FR-99123", items: [
    { ingredientId: "ing-1", name: "Cà chua", price: 20000, quantity: 2 },
    { ingredientId: "ing-2", name: "Thịt bò", price: 150000, quantity: 1 },
  ], total: 170000, status: "completed", createdAt: "2026-10-01T00:00:00Z" };
  const original = JSON.stringify(raw);
  const [order] = normalizeOrders([raw]);
  assert.equal(order.items[0].ingredient.name, "Cà chua");
  assert.equal(order.total, 170000);
  assert.equal(order.deliveryFee, null);
  assert.ok(order.paymentMethod.toUpperCase());
  assert.ok(order.store);
  assert.ok(orderItemMoney(order.items[0]));
  assert.equal(reorderItems(order), null);
  assert.equal(JSON.stringify(raw), original);
  assert.equal(JSON.stringify(normalizeOrders([order])), JSON.stringify([order]));
});

test("incomplete history remains safe for rendering and monthly grouping", () => {
  const [order] = normalizeOrders([null, {}, { _id: {}, items: [] }, {
    orderId: "incomplete", items: [null, {}, { ingredient: null, quantity: -1 }],
    createdAt: new Date("invalid"), total: "invalid", status: "unexpected",
  }]);
  assert.equal(order.orderId, "incomplete");
  assert.equal(order.status, "unknown");
  assert.equal(order.total, null);
  assert.equal(monthKey(order.createdAt), "");
  assert.equal(orderDate(order.createdAt), "Chưa có ngày đặt");
  for (const item of order.items) {
    assert.ok(item.ingredient.name);
    assert.equal(orderItemMoney(item), "Chưa có dữ liệu");
  }
  assert.equal(reorderItems(order), null);
  assert.equal(normalizeOrders(undefined).length, 0);
});

test("new history keeps snapshot prices but reorders use current catalog", () => {
  const recipe = recipes[0], ingredient = recipe.ingredients[0];
  const [order] = normalizeOrders([{ orderId: "new", total: 1234, items: [{
    ingredient: { ...ingredient, price: 1 }, quantity: 2,
    recipeId: recipe.id, recipeTitle: recipe.title,
  }] }]);
  assert.equal(order.items[0].ingredient.price, 1);
  const items = reorderItems(order);
  assert.equal(items[0].ingredient.price, ingredient.price);
  assert.equal(items[0].quantity, 2);
});
test("every recommendation fits the actual ingredient cost at each serving count", () => {
  for (const servings of [1, 2, 3, 4, 20])
    for (const budget of [1, 15000, 50000, 100000, 200000])
      for (const r of recommend(budget, servings)) {
        assert.ok(recipeCost(r, servings) <= budget);
        assert.equal(
          recipeCost(r, servings),
          Math.ceil(
            r.ingredients.reduce(
              (s, i) =>
                s + i.price * Math.ceil((i.quantity * servings) / r.servings),
              0,
            ),
          ),
        );
      }
});
test("low student budget has familiar dishes and tiny budget has empty state", () => {
  assert.ok(recommend(50000, 2).length >= 6);
  assert.equal(recommend(1, 2).length, 0);
});
test("diet and egg exclusions remove matching dishes", () => {
  const list = recommend(50000, 2, "Ăn chay", ["Trứng"]);
  assert.ok(list.some((r) => r.title === "Đậu hũ sốt cà chua"));
  assert.ok(
    !list.some(
      (r) =>
        r.title.includes("trứng") ||
        r.title.includes("Trứng") ||
        r.title.includes("thịt"),
    ),
  );
});
test("catalog totals agree with ingredient totals", () => {
  for (const r of recipes)
    assert.equal(
      r.totalPrice,
      r.ingredients.reduce((s, i) => s + i.price * i.quantity, 0),
    );
});
test("monthly grouping uses Vietnam timezone at UTC month boundary", () => {
  assert.equal(monthKey("2026-09-30T18:00:00Z"), "2026-10");
  assert.equal(monthKey("2026-09-30T16:00:00Z"), "2026-09");
});

const { cartItemPrice } = load("src/lib/catalog.ts");
const { appReducer, initialState } = load("src/context/AppContext.tsx");
test("mixed-store recipe keeps every ingredient and merges repeats", () => {
 const recipe=recipes[0];
 const items=recipe.ingredients.map(ingredient=>({ingredient,quantity:ingredient.quantity,recipeId:recipe.id,recipeTitle:recipe.title}));
 const first=appReducer(initialState,{type:"ADD_MULTIPLE_TO_CART",payload:items});
 assert.equal(first.cart.length,items.length);
 const second=appReducer(first,{type:"ADD_MULTIPLE_TO_CART",payload:items});
 assert.equal(second.cart.length,items.length);
 assert.equal(second.cart[0].quantity,items[0].quantity*2);
});
test("signing out clears user-specific cart and budget", () => {
 const state={...initialState,user:{id:"a",name:"A",email:"a@example.test"},cart:[{}],userBudget:200000};
 const next=appReducer(state,{type:"SET_USER",payload:null});
 assert.equal(next.user,null);assert.equal(next.cart.length,0);assert.equal(next.userBudget,50000);
 assert.equal(initialState.user,null);
});
test("checkout quotes catalog prices even for modified or historical snapshots", () => {
 const recipe=recipes[0],ingredient=recipe.ingredients[0];
 const item={ingredient,recipeId:recipe.id,recipeTitle:recipe.title,quantity:ingredient.quantity*1.5};
 const tampered={...item,ingredient:{...ingredient,price:1,quantity:999,store:"Coop Food"}};
 assert.equal(cartItemPrice(item,"Winmart"),cartItemPrice(tampered,"Winmart"));
});


test("seed catalog has 30 recipes, 20 valid deals and a local image for every item", () => {
  const { recipes, DEALS_DATA } = load("src/data/mockData.ts");
  assert.equal(recipes.length, 30);
  assert.equal(DEALS_DATA.length, 20);
  assert.equal(new Set(recipes.map(r => r.id)).size, 30);
  assert.equal(new Set(DEALS_DATA.map(d => d.ingredientId)).size, 20);
  for (const item of [...recipes, ...DEALS_DATA]) assert.ok(item.image.startsWith("/images/food/") && item.image.endsWith(".webp"));
  for (const d of DEALS_DATA) assert.ok(d.price > 0 && d.price < d.originalPrice);
  for (const item of [...recipes, ...DEALS_DATA, ...recipes.flatMap(r => r.ingredients)]) {
    assert.ok(item.image.startsWith("/images/"));
    assert.ok(fs.existsSync("public" + item.image), item.image);
    const bytes = fs.readFileSync("public" + item.image);
    if (item.image.endsWith(".webp")) { assert.equal(bytes.toString("ascii", 0, 4), "RIFF"); assert.equal(bytes.toString("ascii", 8, 12), "WEBP"); }
    else assert.match(bytes.toString("utf8"), /<svg/);
  }
});


test("cooking guides cover every recipe and distinguish cooking amounts from retail packs", () => {
  for (const recipe of recipes) {
    const guide = recipe.cookingGuide;
    assert.ok(guide, recipe.id);
    assert.equal(guide.baseServings, recipe.servings);
    assert.ok(guide.steps.length >= 6, recipe.id);
    assert.equal(new Set(guide.measures.map(m => m.ingredientId)).size, recipe.ingredients.length);
    for (const i of recipe.ingredients) assert.ok(guide.measures.some(m => m.ingredientId === i.id && m.quantity > 0 && m.unit), i.id);
    for (const step of guide.steps) assert.ok(step.title && step.duration && step.heat && step.detail.trim().length > 0 && step.cue, recipe.id);
    assert.ok(guide.finish && guide.equipment.length);
    for (const item of guide.pantry) assert.ok(item.quantity > 0 && item.unit);
  }
  const soup = recipes.find(r => r.id === "recipe-013");
  assert.ok(soup.ingredients.some(i => i.name === "Thịt heo băm" && i.quantity === 120));
  assert.ok(soup.totalPrice > 14500);
  assert.ok(!recommend(500000, 2, "Ăn chay", [], [soup]).length);
  const pork = recipes.find(r => r.id === "recipe-006");
  assert.ok(pork.ingredients.some(i => i.name === "Trứng gà"));
  assert.ok(!recommend(500000, 3, "Không hạn chế", ["Trứng"], [pork]).length);
});
