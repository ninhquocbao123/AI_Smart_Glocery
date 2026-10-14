import type { ClientSession } from "mongoose";
import { Offer, RetailStore } from "@/models/Commerce";
import { deliveryFees } from "@/lib/catalog";
import { getPriceAtStore } from "@/lib/priceUtils";
import { type Store } from "@/data/mockData";
import { ApiError, integer, stringValue } from "./http";
import { isLive } from "./config";
import dbConnect from "@/lib/mongodb";

import { readCatalog } from "./catalog-data";

export function parseCart(value: unknown) {
  if (!Array.isArray(value) || !value.length || value.length > 100)
    throw new ApiError(400, "Giỏ hàng cần có 1–100 nguyên liệu.");
  const map = new Map<
    string,
    { id: string; recipeId: string; quantity: number }
  >();
  for (const raw of value) {
    if (!raw || typeof raw !== "object")
      throw new ApiError(400, "Nguyên liệu không hợp lệ.");
    const id = stringValue(raw.ingredient?.id ?? raw.id, 1, 100);
    const recipeId = stringValue(raw.recipeId, 1, 100);
    const quantity = integer(raw.quantity, 1, 100000);
    const previous = map.get(id);
    map.set(id, {
      id,
      recipeId,
      quantity: integer((previous?.quantity ?? 0) + quantity, 1, 100000),
    });
  }
  return [...map.values()].sort((a, b) => a.id.localeCompare(b.id));
}
export async function quoteCart(
  value: unknown,
  storeValue: unknown,
  session?: ClientSession,
) {
  const store = stringValue(storeValue);
  if (!Object.hasOwn(deliveryFees, store))
    throw new ApiError(400, "Cửa hàng không hợp lệ.");
  const rows = parseCart(value);
  await dbConnect();
  const config = isLive()
    ? await RetailStore.findOne({ key: store, acceptingOrders: true }).session(
        session ?? null,
      )
    : null;
  if (isLive() && !config)
    throw new ApiError(
      409,
      "Cửa hàng chưa nhận đơn qua ứng dụng. Bạn có thể mua tại website chính thức.",
    );
  const { recipes, deals } = await readCatalog();
  const items = [];
  for (const row of rows) {
    const deal = deals.find(d => d.ingredientId === row.id);
    const base = deal ? { ...deal, id: deal.ingredientId, quantity: 1 } : recipes.find(r => r.id === row.recipeId)?.ingredients.find(i => i.id === row.id);
    const offer = isLive()
      ? await Offer.findOne({
          store,
          ingredientId: row.id,
          active: true,
          validUntil: { $gt: new Date() },
          stock: { $gte: row.quantity },
        }).session(session ?? null)
      : null;
    if (isLive() && !offer)
      throw new ApiError(
        409,
        "Một nguyên liệu thiếu giá hiện hành hoặc không đủ tồn kho. Vui lòng kiểm tra lại giỏ.",
      );
    if (!base && !offer)
      throw new ApiError(400, "Nguyên liệu không có trong danh mục.");
    if (offer && base && offer.unit !== base.unit)
      throw new ApiError(
        409,
        "Đơn vị sản phẩm chưa khớp công thức. Cần cập nhật danh mục.",
      );
    const price = offer
      ? offer.price
      : getPriceAtStore(base!, store as Store) / base!.quantity;
    items.push({
      ingredient: {
        id: row.id,
        name: offer?.name ?? base!.name,
        unit: offer?.unit ?? base!.unit,
        price,
        quantity: 1,
        store: store as Store,
        category: offer?.category ?? base?.category ?? "Khác",
        image: base?.image ?? "",
      },
      quantity: row.quantity,
      recipeId: row.recipeId,
      recipeTitle:
        recipes.find((r) => r.id === row.recipeId)?.title ??
        "Nguyên liệu cửa hàng",
      sku: offer?.sku,
    });
  }
  const deliveryFee = config
    ? config.deliveryFee
    : deliveryFees[store as Store];
  const total = Math.round(
    items.reduce((s, i) => s + i.ingredient.price * i.quantity, 0) +
      deliveryFee,
  );
  integer(total, 1000, 50000000);
  return {
    items,
    total,
    deliveryFee,
    store,
    mode: isLive() ? "live" : "demo",
    sellerName: config?.sellerName ?? "",
    branch: config?.branch ?? "",
    serviceArea: config?.serviceArea ?? "",
  };
}
