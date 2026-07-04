"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Trash2,
  ChefHat,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  PackageOpen,
  Plus,
  Minus,
  Layers,
  AlertTriangle,
  TrendingUp,
  Tag,
  ReceiptText,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { formatVND } from "@/lib/priceUtils";
import type { Store as StoreType } from "@/data/mockData";

// ─────────────────────────────────────────────────────────────
// Store config
// ─────────────────────────────────────────────────────────────

const storeConfig: Record<
  StoreType,
  {
    color: string;
    textDark: string;
    bg: string;
    bgStrong: string;
    border: string;
    badge: string;
    headerBg: string;
    icon: string;
    label: string;
  }
> = {
  "Bach Hoa Xanh": {
    color: "text-[#388E3C]",
    textDark: "text-[#1B5E20]",
    bg: "bg-[#4CAF50]/6",
    bgStrong: "bg-[#4CAF50]/12",
    border: "border-[#4CAF50]/25",
    badge: "bg-[#4CAF50]/15 text-[#1B5E20]",
    headerBg: "bg-gradient-to-r from-[#4CAF50]/12 to-transparent",
    icon: "🟢",
    label: "Bach Hoa Xanh",
  },
  Winmart: {
    color: "text-[#E64A19]",
    textDark: "text-[#BF360C]",
    bg: "bg-[#FF6F00]/6",
    bgStrong: "bg-[#FF6F00]/12",
    border: "border-[#FF6F00]/25",
    badge: "bg-[#FF6F00]/15 text-[#BF360C]",
    headerBg: "bg-gradient-to-r from-[#FF6F00]/12 to-transparent",
    icon: "🟠",
    label: "Winmart",
  },
  "Coop Food": {
    color: "text-[#1565C0]",
    textDark: "text-[#0D47A1]",
    bg: "bg-[#1565C0]/6",
    bgStrong: "bg-[#1565C0]/12",
    border: "border-[#1565C0]/25",
    badge: "bg-[#1565C0]/15 text-[#0D47A1]",
    headerBg: "bg-gradient-to-r from-[#1565C0]/12 to-transparent",
    icon: "🔵",
    label: "Coop Food",
  },
};

const categoryEmoji: Record<string, string> = {
  "Đạm": "🥩",
  "Rau củ": "🥦",
  "Tinh bột": "🌾",
  "Gia vị": "🌶️",
  "Rau thơm": "🌿",
  "Nước sốt": "🫙",
  "Bơ sữa": "🥛",
  "Trái cây": "🍋",
  "Dầu ăn": "🫒",
  "Ăn vặt": "🥜",
  "Đồ rắc": "✨",
  "Đồ uống": "🥤",
};

// ─────────────────────────────────────────────────────────────
// Toggle Switch component
// ─────────────────────────────────────────────────────────────

function ToggleSwitch({
  enabled,
  onChange,
  id,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`
        relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full
        border-2 border-transparent transition-colors duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1
        ${enabled ? "bg-primary" : "bg-outline/40"}
      `}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={`
          inline-block h-5 w-5 rounded-full bg-white shadow-md
          ${enabled ? "translate-x-5" : "translate-x-0"}
        `}
      />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// Budget Progress Bar (standalone section)
// ─────────────────────────────────────────────────────────────

function BudgetProgressBar({
  cartTotal,
  userBudget,
  itemCount,
}: {
  cartTotal: number;
  userBudget: number;
  itemCount: number;
}) {
  const percent = userBudget > 0 ? Math.min((cartTotal / userBudget) * 100, 100) : 0;
  const isOver = cartTotal > userBudget;
  const overAmount = cartTotal - userBudget;
  const remaining = userBudget - cartTotal;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={`
        rounded-2xl border-2 overflow-hidden
        ${isOver
          ? "border-error/30 bg-error-container/20"
          : "border-primary-container bg-primary-container/20"
        }
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          {isOver ? (
            <AlertTriangle className="w-5 h-5 text-error" />
          ) : (
            <TrendingUp className="w-5 h-5 text-primary" />
          )}
          <span className="text-sm font-bold text-on-surface">
            Tiến độ ngân sách
          </span>
        </div>
        <span
          className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            isOver
              ? "bg-error/15 text-error"
              : percent > 75
              ? "bg-secondary/15 text-secondary"
              : "bg-primary/15 text-primary"
          }`}
        >
          Đã dùng {Math.round(percent)}%
        </span>
      </div>

      {/* Bar */}
      <div className="px-5 pb-2">
        <div className="h-3 rounded-full bg-surface-container overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            className={`h-full rounded-full transition-colors duration-500 ${
              isOver
                ? "bg-error"
                : percent > 75
                ? "bg-secondary"
                : "bg-primary"
            }`}
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 divide-x divide-outline-variant/30 border-t border-outline-variant/30 mt-1">
        <div className="px-4 py-3 text-center">
          <p className="text-[11px] text-on-surface-variant mb-0.5">Ngân sách</p>
          <p className="text-sm font-extrabold text-on-surface">
            {formatVND(userBudget)}
          </p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-[11px] text-on-surface-variant mb-0.5">
            Giỏ hàng ({itemCount} món)
          </p>
          <p className={`text-sm font-extrabold ${isOver ? "text-error" : "text-primary"}`}>
            {formatVND(cartTotal)}
          </p>
        </div>
        <div className="px-4 py-3 text-center">
          <p className="text-[11px] text-on-surface-variant mb-0.5">
            {isOver ? "Vượt ngân sách" : "Còn lại"}
          </p>
          <p className={`text-sm font-extrabold ${isOver ? "text-error" : "text-primary"}`}>
            {isOver ? `−${formatVND(overAmount)}` : formatVND(remaining)}
          </p>
        </div>
      </div>

      {/* Over-budget warning */}
      <AnimatePresence>
        {isOver && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-5 pb-4"
          >
            <div className="flex items-start gap-2 mt-1 p-3 rounded-xl bg-error/8 border border-error/20">
              <AlertTriangle className="w-4 h-4 text-error flex-shrink-0 mt-0.5" />
              <p className="text-xs text-error leading-relaxed">
                Giỏ hàng của bạn đã vượt quá ngân sách là{" "}
                <strong>{formatVND(overAmount)}</strong>. Vui lòng xóa bớt sản phẩm hoặc quay lại điều chỉnh ngân sách.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Store Group Card
// ─────────────────────────────────────────────────────────────

function StoreCard({
  store,
  items,
  consolidated,
  onRemove,
  onQtyChange,
  index,
}: {
  store: StoreType;
  items: ReturnType<typeof useAppContext>["state"]["cart"];
  consolidated: boolean;
  onRemove: (id: string) => void;
  onQtyChange: (id: string, qty: number) => void;
  index: number;
}) {
  const sc = storeConfig[store];
  const storeTotal = items.reduce(
    (sum, item) => sum + item.ingredient.price * item.quantity,
    0
  );
  // Simulate a savings amount when consolidated
  const consolidateSaving = Math.round(storeTotal * 0.03);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, height: 0 }}
      transition={{ delay: 0.1 + index * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border-2 overflow-hidden ${sc.bg} ${sc.border}`}
    >
      {/* ── Store header ── */}
      <div className={`${sc.headerBg} px-5 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface/80 flex items-center justify-center text-xl shadow-sm">
            {sc.icon}
          </div>
          <div>
            <h2 className={`text-base font-extrabold ${sc.textDark}`}>
              {sc.label}
            </h2>
            <p className="text-xs text-on-surface-variant">
              Có {items.length} nguyên liệu cần mua
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1">
          <div className={`px-3 py-1.5 rounded-xl text-sm font-bold ${sc.badge}`}>
            {formatVND(storeTotal)}
          </div>
          {consolidated && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-1 text-[10px] font-semibold text-primary"
            >
              <Tag className="w-3 h-3" />
              Tiết kiệm {formatVND(consolidateSaving)}
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Items list ── */}
      <div className="divide-y divide-outline-variant/15">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={`${item.ingredient.id}-${item.recipeId}`}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30, height: 0, paddingTop: 0, paddingBottom: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 px-5 py-3.5"
            >
              {/* Ingredient Image or Category emoji */}
              <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 relative bg-surface border border-outline-variant">
                {item.ingredient.image ? (
                  <img
                    src={item.ingredient.image}
                    alt={item.ingredient.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const parent = target.parentElement;
                      if (parent) {
                        const fallbackDiv = parent.querySelector(".fallback-emoji-container") as HTMLDivElement;
                        if (fallbackDiv) {
                          fallbackDiv.style.display = "flex";
                        }
                      }
                    }}
                  />
                ) : null}
                <div
                  className="fallback-emoji-container absolute inset-0 items-center justify-center text-lg bg-surface-container"
                  style={{ display: item.ingredient.image ? "none" : "flex" }}
                >
                  {categoryEmoji[item.ingredient.category] ?? "🛒"}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">
                  {item.ingredient.name}
                </p>
                <p className="text-xs text-on-surface-variant truncate">
                  {item.ingredient.unit} ·{" "}
                  <span className="italic">{item.recipeTitle}</span>
                </p>
              </div>

              {/* Qty stepper */}
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <button
                  onClick={() => {
                    if (item.quantity <= 1) onRemove(item.ingredient.id);
                    else onQtyChange(item.ingredient.id, item.quantity - 1);
                  }}
                  className={`
                    w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant
                    ${sc.bgStrong} hover:bg-error/15 hover:text-error transition-colors cursor-pointer
                  `}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="text-sm font-bold text-on-surface w-5 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => onQtyChange(item.ingredient.id, item.quantity + 1)}
                  className={`
                    w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant
                    ${sc.bgStrong} hover:bg-primary/15 hover:text-primary transition-colors cursor-pointer
                  `}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>

              {/* Price */}
              <div className="text-right min-w-[76px] flex-shrink-0">
                <p className="text-sm font-bold text-on-surface">
                  {formatVND(item.ingredient.price * item.quantity)}
                </p>
                {item.quantity > 1 && (
                  <p className="text-[10px] text-on-surface-variant">
                    {formatVND(item.ingredient.price)} / {item.ingredient.unit}
                  </p>
                )}
              </div>

              {/* Remove */}
              <button
                onClick={() => onRemove(item.ingredient.id)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-error/12 hover:text-error transition-colors cursor-pointer flex-shrink-0"
                aria-label={`Remove ${item.ingredient.name}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Store subtotal footer */}
      <div className={`${sc.headerBg} px-5 py-3 flex items-center justify-between border-t ${sc.border}`}>
        <span className="text-xs font-medium text-on-surface-variant">
          Tạm tính cho {sc.label}
        </span>
        <span className={`text-sm font-extrabold ${sc.textDark}`}>
          {formatVND(storeTotal)}
        </span>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page — Screen 4: Integrated Shopping Cart
// ─────────────────────────────────────────────────────────────

export default function GroceryStorePage() {
  const {
    state,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
    isOverBudget,
  } = useAppContext();
  const { cart } = state;

  const activeStore = state.selectedStore || (cart.length > 0 ? cart[0].ingredient.store : "Winmart");
  const [checkedOut, setCheckedOut] = useState(false);

  // ── Empty state ──
  if (cart.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-md">
            <ShoppingCart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
              Giỏ hàng
            </h1>
            <p className="text-sm text-on-surface-variant">
              Danh sách đi chợ của bạn đang trống
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-outlined p-16 text-center"
        >
          <PackageOpen className="w-20 h-20 text-on-surface-variant mx-auto mb-5 opacity-20" />
          <h2 className="text-xl font-bold text-on-surface mb-2">
            Chưa có sản phẩm nào trong giỏ hàng
          </h2>
          <p className="text-sm text-on-surface-variant mb-6 max-w-xs mx-auto">
            Duyệt công thức, nhấn chọn món ăn và bấm{" "}
            <strong>Thêm vào giỏ hàng</strong> để bắt đầu lên danh sách đi chợ.
          </p>
          <Link href="/meal-plan" className="btn-filled">
            <ChefHat className="w-4 h-4 mr-2 inline" />
            Duyệt công thức
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-36">
      {/* ═══════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Link
          href="/meal-plan"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách công thức
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-md flex-shrink-0">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
                Giỏ hàng
              </h1>
              <p className="text-sm text-on-surface-variant">
                Có <span className="font-semibold text-primary">{cartItemCount}</span>{" "}
                nguyên liệu sẵn sàng thanh toán
              </p>
            </div>
          </div>
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-sm text-error hover:bg-error/8 px-3 py-2 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="w-4 h-4" />
            Xóa tất cả
          </button>
        </div>
      </motion.div>

      {/* Consolidation toggle removed */}

      {/* ═══════════════════════════════════════════════════════
          BUDGET PROGRESS BAR
          ═══════════════════════════════════════════════════════ */}
      <BudgetProgressBar
        cartTotal={cartTotal}
        userBudget={state.userBudget}
        itemCount={cartItemCount}
      />

      {/* ═══════════════════════════════════════════════════════
          SINGLE STORE LAYOUT
          ═══════════════════════════════════════════════════════ */}
      <div className="space-y-4">
        {/* Banner */}
        <div className="flex items-center gap-3 p-5 rounded-3xl bg-surface border-2 border-outline-variant shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
            {storeConfig[activeStore]?.icon || "🛒"}
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-on-surface">
              Đơn hàng từ {activeStore}
            </h2>
            <p className="text-xs text-on-surface-variant">
              Tất cả sản phẩm và giá cả được đồng bộ từ siêu thị này
            </p>
          </div>
        </div>

        {/* List of items */}
        <div className="rounded-3xl border-2 border-outline-variant overflow-hidden bg-surface">
          <div className="divide-y divide-outline-variant/15">
            <AnimatePresence>
              {cart.map((item, i) => {
                const sc = storeConfig[activeStore];
                return (
                  <motion.div
                    key={`${item.ingredient.id}-${item.recipeId}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30, height: 0, paddingTop: 0, paddingBottom: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    {/* Category emoji badge */}
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center flex-shrink-0 text-lg">
                      {categoryEmoji[item.ingredient.category] ?? "🛒"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-on-surface truncate">
                        {item.ingredient.name}
                      </p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {item.ingredient.unit} ·{" "}
                        <span className="italic">{item.recipeTitle}</span>
                      </p>
                    </div>

                    {/* Qty stepper */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => {
                          if (item.quantity <= 1) removeFromCart(item.ingredient.id);
                          else updateCartQuantity(item.ingredient.id, item.quantity - 1);
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant bg-surface-container hover:bg-error/15 hover:text-error transition-colors cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-sm font-bold text-on-surface w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.ingredient.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-on-surface-variant bg-surface-container hover:bg-primary/15 hover:text-primary transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[76px] flex-shrink-0">
                      <p className="text-sm font-bold text-on-surface">
                        {formatVND(item.ingredient.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-on-surface-variant">
                          {formatVND(item.ingredient.price)} / {item.ingredient.unit}
                        </p>
                      )}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.ingredient.id)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-error/12 hover:text-error transition-colors cursor-pointer flex-shrink-0"
                      aria-label={`Remove ${item.ingredient.name}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Subtotal Footer */}
          <div className="px-5 py-4 bg-surface-container/30 flex items-center justify-between border-t border-outline-variant/15">
            <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Tổng tiền nguyên liệu
            </span>
            <span className="text-lg font-extrabold text-primary">
              {formatVND(cartTotal)}
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          ORDER SUMMARY
          ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-surface-container border border-outline-variant overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-outline-variant">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <ReceiptText className="w-4 h-4 text-primary" />
            Tóm tắt đơn hàng
          </h3>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Tạm tính</span>
            <span className="text-sm font-semibold text-on-surface">
              {formatVND(cartTotal)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface-variant">Phí vận chuyển</span>
            <span className="text-sm font-semibold text-primary">Miễn phí</span>
          </div>

          <div className="border-t border-outline-variant pt-3">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-on-surface">
                Tổng thanh toán
              </span>
              <span className={`text-xl font-extrabold ${isOverBudget ? "text-error" : "text-primary"}`}>
                {formatVND(cartTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* AI tip */}
        <div className="px-5 pb-4">
          <div className="flex items-start gap-2 p-3 rounded-xl bg-surface border border-outline-variant/50">
            <Sparkles className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-on-surface-variant leading-relaxed">
              <span className="font-semibold text-on-surface">Mẹo AI:</span>{" "}
              Lựa chọn tuyệt vời! Tất cả nguyên liệu đều ở cùng một siêu thị {activeStore} — mua sắm tiện lợi và nhanh chóng.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── STICKY CHECKOUT BAR ── */}
      <div className="sticky bottom-16 md:bottom-0 z-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 bg-surface/95 backdrop-blur-xl border-t-2 border-outline-variant/60 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] mt-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: totals */}
          <div>
            <p className="text-xs text-on-surface-variant mb-0.5">
              Đã sẵn sàng {cartItemCount} nguyên liệu
            </p>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-xl font-extrabold ${isOverBudget ? "text-error" : "text-primary"}`}>
                {formatVND(cartTotal)}
              </span>
              {isOverBudget && (
                <span className="text-xs font-semibold text-error">
                  Vượt ngân sách!
                </span>
              )}
            </div>
          </div>

          {/* Right: Proceed to Checkout */}
          <Link href="/checkout">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              className={`
                flex items-center gap-2.5 px-7 py-3.5 rounded-2xl text-sm font-bold
                shadow-lg cursor-pointer select-none transition-colors
                ${isOverBudget
                  ? "bg-error text-on-error"
                  : "gradient-primary text-on-primary"
                }
              `}
            >
              <CheckCircle2 className="w-5 h-5" />
              Thanh toán
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}
