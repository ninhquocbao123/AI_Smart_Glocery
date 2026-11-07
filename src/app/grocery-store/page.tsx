"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ShoppingBasket,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Store,
  Tag,
  CheckCircle2,
  Sparkles,
  ChefHat,
} from "lucide-react";
import UserPageHeader from "@/components/ui/UserPageHeader";
import { useAppContext, type CartItem } from "@/context/AppContext";
import { formatVND } from "@/lib/priceUtils";

const storeBadgeColors: Record<string, string> = {
  "Bach Hoa Xanh": "bg-emerald-50 text-emerald-800 border-emerald-200",
  Winmart: "bg-amber-50 text-amber-800 border-amber-200",
  "Coop Food": "bg-blue-50 text-blue-800 border-blue-200",
};

export default function CartPage() {
  const { state, removeFromCart, updateCartQuantity } = useAppContext();
  const router = useRouter();
  const [excluded, setExcluded] = useState<string[]>([]);

  // Group cart items by recipe
  const groups = Array.from(
    state.cart
      .reduce((map, item) => {
        const group = map.get(item.recipeId) ?? {
          id: item.recipeId,
          title: item.recipeTitle,
          items: [] as CartItem[],
        };
        group.items.push(item);
        map.set(item.recipeId, group);
        return map;
      }, new Map<string, { id: string; title: string; items: CartItem[] }>())
      .values(),
  );

  const selected = groups.filter((g) => !excluded.includes(g.id));
  const total = selected.reduce(
    (sum, g) =>
      sum +
      g.items.reduce((s, i) => s + i.quantity * i.ingredient.price, 0),
    0,
  );

  const totalSelectedItemsCount = selected.reduce(
    (sum, g) => sum + g.items.length,
    0,
  );

  function checkout() {
    if (!selected.length) return;
    const query = new URLSearchParams();
    selected.forEach((g) => query.append("recipe", g.id));
    router.push("/checkout?" + query.toString());
  }

  const allSelected = selected.length === groups.length && groups.length > 0;

  return (
    <div className="space-y-6">
      <UserPageHeader
        eyebrow="GIỎ NGUYÊN LIỆU THÔNG MINH"
        title="Danh sách đi chợ của bạn"
        description="Nguyên liệu được gom theo từng món ăn. Bạn có thể chọn mua tất cả hoặc chọn lọc từng món theo nhu cầu."
        action={
          <Link
            href="/meal-plan"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-sm text-slate-700 transition-all shadow-sm"
          >
            <Plus size={16} />
            <span>Thêm món ăn khác</span>
          </Link>
        }
      />

      {!groups.length ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-14 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-18 h-18 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <ShoppingBasket size={38} strokeWidth={1.7} />
          </div>
          <h2 className="text-xl font-extrabold text-slate-900 mb-2">
            Giỏ nguyên liệu đang trống
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto mb-6">
            Bạn chưa chọn món nào vào giỏ. Hãy dạo quanh mục Khám phá món ăn hoặc
            nhờ AI gợi ý thực đơn phù hợp ngân sách!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/meal-plan"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all"
            >
              <ChefHat size={16} />
              <span>Khám phá món Việt</span>
            </Link>
            <Link
              href="/meal-plan/ai"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-sm transition-all"
            >
              <Sparkles size={16} />
              <span>Thực đơn AI</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Recipe Groups & Ingredients (8 cols) ── */}
          <div className="lg:col-span-8 space-y-5">
            {/* Master Select Bar */}
            <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
              <label className="flex items-center gap-3 font-bold text-sm text-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) {
                      el.indeterminate =
                        selected.length > 0 && selected.length < groups.length;
                    }
                  }}
                  onChange={(e) =>
                    setExcluded(e.target.checked ? [] : groups.map((g) => g.id))
                  }
                  className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
                />
                <span>
                  Chọn tất cả ({groups.length} món · {state.cart.length} nguyên liệu)
                </span>
              </label>

              <span className="text-xs font-semibold text-slate-500">
                Đã chọn {selected.length}/{groups.length} nhóm
              </span>
            </div>

            {/* List of Recipe Cards */}
            {groups.map((group) => {
              const isGroupSelected = !excluded.includes(group.id);
              const groupSubtotal = group.items.reduce(
                (s, i) => s + i.quantity * i.ingredient.price,
                0,
              );

              return (
                <section
                  key={group.id}
                  className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 shadow-sm ${
                    isGroupSelected
                      ? "border-slate-200 ring-1 ring-emerald-500/10"
                      : "border-slate-200/60 opacity-60"
                  }`}
                >
                  {/* Group Header */}
                  <header className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50/80 to-teal-50/40 border-b border-slate-200/80 flex items-center justify-between gap-4 flex-wrap">
                    <label className="flex items-center gap-3 font-extrabold text-base text-slate-900 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isGroupSelected}
                        onChange={(e) =>
                          setExcluded((ids) =>
                            e.target.checked
                              ? ids.filter((id) => id !== group.id)
                              : [...ids, group.id],
                          )
                        }
                        className="w-5 h-5 rounded accent-emerald-600 cursor-pointer"
                      />
                      <div className="flex items-center gap-2">
                        <ChefHat size={18} className="text-emerald-700" />
                        <span>{group.title || "Nguyên liệu mua lẻ"}</span>
                      </div>
                    </label>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-slate-500">
                        {group.items.length} nguyên liệu
                      </span>
                      <strong className="text-base font-extrabold text-emerald-800">
                        {formatVND(groupSubtotal)}
                      </strong>
                    </div>
                  </header>

                  {/* Group Ingredient Rows */}
                  <div className="divide-y divide-slate-100">
                    {group.items.map((item) => {
                      const badgeStyle =
                        storeBadgeColors[item.ingredient.store] ??
                        "bg-slate-100 text-slate-700 border-slate-200";

                      return (
                        <div
                          key={item.ingredient.id}
                          className="p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap hover:bg-slate-50/60 transition-colors"
                        >
                          {/* Left: Info */}
                          <div className="flex-1 min-w-[180px]">
                            <h3 className="font-bold text-sm sm:text-base text-slate-900">
                              {item.ingredient.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span
                                className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded border ${badgeStyle}`}
                              >
                                <Store size={11} />
                                {item.ingredient.store}
                              </span>
                              <span className="text-xs text-slate-500 font-medium">
                                {formatVND(item.ingredient.price)} / {item.ingredient.unit}
                              </span>
                            </div>
                          </div>

                          {/* Middle: Stepper */}
                          <div className="flex items-center gap-3">
                            <div className="flex items-center border border-slate-200 rounded-xl bg-white shadow-sm overflow-hidden">
                              <button
                                type="button"
                                aria-label="Giảm số lượng"
                                disabled={item.quantity <= 1}
                                onClick={() =>
                                  updateCartQuantity(
                                    item.ingredient.id,
                                    Math.max(1, item.quantity - 1),
                                    group.id,
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus size={14} />
                              </button>
                              <input
                                aria-label={`Số lượng ${item.ingredient.name}`}
                                type="number"
                                min={1}
                                max={100000}
                                value={item.quantity}
                                onChange={(e) => {
                                  const val = Number(e.target.value);
                                  if (
                                    Number.isInteger(val) &&
                                    val >= 1 &&
                                    val <= 100000
                                  ) {
                                    updateCartQuantity(
                                      item.ingredient.id,
                                      val,
                                      group.id,
                                    );
                                  }
                                }}
                                className="w-12 text-center text-sm font-extrabold text-slate-800 outline-none border-x border-slate-100"
                              />
                              <button
                                type="button"
                                aria-label="Tăng số lượng"
                                onClick={() =>
                                  updateCartQuantity(
                                    item.ingredient.id,
                                    item.quantity + 1,
                                    group.id,
                                  )
                                }
                                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                              >
                                <Plus size={14} />
                              </button>
                            </div>
                            <span className="text-xs font-semibold text-slate-500 min-w-8">
                              {item.ingredient.unit}
                            </span>
                          </div>

                          {/* Right: Item Total & Delete */}
                          <div className="flex items-center gap-4">
                            <strong className="text-sm sm:text-base font-extrabold text-emerald-800 min-w-[85px] text-right">
                              {formatVND(item.quantity * item.ingredient.price)}
                            </strong>

                            <button
                              aria-label={`Xóa ${item.ingredient.name} khỏi giỏ`}
                              onClick={() =>
                                removeFromCart(item.ingredient.id, group.id)
                              }
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          {/* ── Right Column: Sticky Checkout Order Summary (4 cols) ── */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md space-y-5">
              <h2 className="text-lg font-extrabold text-slate-900 border-b border-slate-100 pb-3">
                Tóm tắt đơn đi chợ
              </h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Món ăn đã chọn</span>
                  <span className="font-bold text-slate-900">
                    {selected.length} / {groups.length} món
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Tổng nguyên liệu</span>
                  <span className="font-bold text-slate-900">
                    {totalSelectedItemsCount} mục
                  </span>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Phí giao dự kiến</span>
                  <span className="text-emerald-700 font-bold">
                    Tính ở bước sau
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="font-bold text-base text-slate-900">
                    Tạm tính nguyên liệu
                  </span>
                  <span className="text-2xl font-black text-emerald-700">
                    {formatVND(total)}
                  </span>
                </div>
              </div>

              <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-100 text-xs text-emerald-900 space-y-1 leading-relaxed">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span>Tiết kiệm thông minh</span>
                </div>
                <p>
                  Các món được chọn sẽ được tự động gom nhóm để bạn thanh toán tiện
                  lợi nhất qua MoMo hoặc chuyển khoản ngân hàng.
                </p>
              </div>

              <button
                disabled={!selected.length}
                onClick={checkout}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-lg shadow-emerald-700/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <span>Tiến hành đặt mua</span>
                <ArrowRight size={18} />
              </button>

              <div className="pt-2 flex items-center justify-center gap-2 text-xs font-semibold text-slate-500">
                <ShieldCheck size={15} className="text-emerald-600" />
                <span>Bảo đảm nguồn nguyên liệu an toàn 100%</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs font-bold text-emerald-800">
              <Link
                href="/meal-plan"
                className="hover:underline flex items-center gap-1"
              >
                <Plus size={14} /> Thêm món ngon khác
              </Link>
              <Link href="/deals" className="hover:underline flex items-center gap-1">
                <Tag size={14} /> Xem ưu đãi giờ vàng
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
