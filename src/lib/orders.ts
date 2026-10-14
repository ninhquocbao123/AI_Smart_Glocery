import type { CartItem } from "@/context/AppContext";
import { catalogIngredient } from "./catalog";
import { formatVND } from "./priceUtils";

export const orderLabels = {
  unpaid: "Chưa thanh toán",
  confirmed: "Chờ chuẩn bị",
  delivering: "Đang giao",
  delivered: "Đã giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
  unknown: "Chưa rõ trạng thái",
};
export type OrderStatus = keyof typeof orderLabels;

// Order history is a saved snapshot, not necessarily a current catalog item.
export interface OrderHistoryItem {
  ingredient: { id: string; name: string; unit: string; price: number | null };
  quantity: number | null;
  recipeId: string;
  recipeTitle: string;
}
export interface GroceryOrder {
  _id: string;
  orderId: string;
  items: OrderHistoryItem[];
  store: string;
  address: string;
  total: number | null;
  deliveryFee: number | null;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  mode?: string;
  paymentStatus?: string;
  paymentStarted?: boolean;
  paymentEnvironment?: string;
}

type RawRecord = Record<string, unknown>;
function record(value: unknown): RawRecord {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as RawRecord : {};
}
function text(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}
function amount(value: unknown): number | null {
  if (typeof value !== "number" && (typeof value !== "string" || !value.trim())) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}
function normalizeItem(value: unknown): OrderHistoryItem {
  const item = record(value);
  const nested = record(item.ingredient);
  // Legacy seed: { ingredientId, name, price, quantity }. New: { ingredient: {...}, quantity }.
  const ingredient = Object.keys(nested).length ? nested : item;
  const quantity = amount(item.quantity);
  return {
    ingredient: {
      id: text(ingredient.id, text(item.ingredientId)),
      name: text(ingredient.name, text(item.name, "Mặt hàng chưa có thông tin")),
      unit: text(ingredient.unit, text(item.unit)),
      price: amount(ingredient.price),
    },
    quantity: quantity !== null && quantity > 0 ? quantity : null,
    recipeId: text(item.recipeId),
    recipeTitle: text(item.recipeTitle, "Đơn hàng trước đây"),
  };
}

/** Read adapter only: never rewrite historical amounts or mutate stored orders. */
export function normalizeOrders(value: unknown): GroceryOrder[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry): GroceryOrder[] => {
    const raw = record(entry);
    const id = text(raw._id);
    const orderId = text(raw.orderId, id);
    if (!orderId) return [];
    const dateValue = raw.createdAt instanceof Date
      ? (Number.isFinite(raw.createdAt.getTime()) ? raw.createdAt.toISOString() : "")
      : text(raw.createdAt);
    const createdAt = Number.isFinite(Date.parse(dateValue)) ? dateValue : "";
    const status = text(raw.status);
    return [{
      _id: id || orderId,
      orderId,
      items: Array.isArray(raw.items) ? raw.items.map(normalizeItem) : [],
      store: text(raw.store, "Chưa có thông tin cửa hàng"),
      address: text(raw.address, "Chưa có thông tin địa chỉ"),
      total: amount(raw.total),
      deliveryFee: amount(raw.deliveryFee),
      paymentMethod: text(raw.paymentMethod, "Chưa có thông tin"),
      status: Object.hasOwn(orderLabels, status) ? status as OrderStatus : "unknown",
      createdAt,
      mode: text(raw.mode, "demo"),
      paymentStatus: text(raw.paymentStatus),
      paymentStarted: raw.paymentStarted === true || !!record(raw.payment).startedAt,
      paymentEnvironment: text(raw.paymentEnvironment, text(record(raw.payment).environment)),
    }];
  });
}

export function orderMoney(value: number | null): string {
  return value === null ? "Chưa có dữ liệu" : formatVND(value);
}
export function orderItemMoney(item: OrderHistoryItem): string {
  return orderMoney(item.quantity === null || item.ingredient.price === null
    ? null : item.quantity * item.ingredient.price);
}
export function orderDate(value: string, dateOnly = false): string {
  if (!value || !Number.isFinite(Date.parse(value))) return "Chưa có ngày đặt";
  return dateOnly
    ? new Date(value).toLocaleDateString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })
    : new Date(value).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
}
export function reorderItems(order: GroceryOrder): CartItem[] | null {
  if (!order.items.length) return null;
  const items: CartItem[] = [];
  for (const item of order.items) {
    const ingredient = catalogIngredient(item.ingredient.id, item.recipeId);
    if (!ingredient || item.quantity === null || item.quantity > 100000) return null;
    items.push({ ingredient, quantity: item.quantity, recipeId: item.recipeId, recipeTitle: item.recipeTitle });
  }
  return items;
}
export function monthKey(date: string | Date) {
  const parsed = new Date(date);
  if (!Number.isFinite(parsed.getTime())) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh", year: "numeric", month: "2-digit",
  }).formatToParts(parsed);
  return parts.find(p => p.type === "year")!.value + "-" + parts.find(p => p.type === "month")!.value;
}
