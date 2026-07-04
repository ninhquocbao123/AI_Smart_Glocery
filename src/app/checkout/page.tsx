"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  Clock,
  MapPin,
  Package,
  Bike,
  Home,
  ChevronRight,
  PartyPopper,
  CreditCard,
  Banknote,
  Smartphone,
  ShoppingBag,
  Star,
  RotateCcw,
  Truck,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { formatVND } from "@/lib/priceUtils";
import type { Store as StoreType } from "@/data/mockData";

// ─────────────────────────────────────────────────────────────
// Payment Methods
// ─────────────────────────────────────────────────────────────

type PaymentId = "momo" | "zalopay" | "cash";

interface PaymentMethod {
  id: PaymentId;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
  border: string;
  badge?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "momo",
    label: "Ví MoMo",
    description: "Thanh toán tức thì qua ví điện tử MoMo",
    icon: <Smartphone className="w-5 h-5" />,
    color: "text-[#AE2070]",
    bg: "bg-[#AE2070]/8",
    border: "border-[#AE2070]/30",
    badge: "Hoàn tiền 2%",
  },
  {
    id: "zalopay",
    label: "ZaloPay",
    description: "Thanh toán nhanh chóng, bảo mật qua ZaloPay",
    icon: <CreditCard className="w-5 h-5" />,
    color: "text-[#0068FF]",
    bg: "bg-[#0068FF]/8",
    border: "border-[#0068FF]/30",
    badge: "Tức thì",
  },
  {
    id: "cash",
    label: "Thanh toán khi nhận hàng",
    description: "Thanh toán bằng tiền mặt khi nhận hàng (COD)",
    icon: <Banknote className="w-5 h-5" />,
    color: "text-[#2E7D32]",
    bg: "bg-[#2E7D32]/8",
    border: "border-[#2E7D32]/30",
  },
];

// ─────────────────────────────────────────────────────────────
// Delivery Timeline Steps
// ─────────────────────────────────────────────────────────────

interface TimelineStep {
  id: string;
  icon: React.ReactNode;
  label: string;
  eta: string;
  detail: string;
  status: "done" | "active" | "pending";
}

function buildTimeline(stores: StoreType[]): TimelineStep[] {
  const storeLabel = stores.length > 1 ? `${stores[0]} & ${stores.length - 1} cửa hàng khác` : stores[0] ?? "Cửa hàng";

  return [
    {
      id: "confirmed",
      icon: <CheckCircle2 className="w-4 h-4" />,
      label: "Đơn hàng đã xác nhận",
      eta: "Vừa xong",
      detail: "Đơn hàng của bạn đã được nhận và đang được xử lý.",
      status: "done",
    },
    {
      id: "preparing",
      icon: <Package className="w-4 h-4" />,
      label: `Đang chuẩn bị tại ${storeLabel}`,
      eta: "5 – 10 phút",
      detail: "Nhân viên đang chuẩn bị và đóng gói nguyên liệu tươi ngon.",
      status: "active",
    },
    {
      id: "dispatched",
      icon: <Bike className="w-4 h-4" />,
      label: "Đang giao hàng",
      eta: "15 – 20 phút",
      detail: "Tài xế đang lấy hàng và trên đường giao đến bạn.",
      status: "pending",
    },
    {
      id: "arrived",
      icon: <Home className="w-4 h-4" />,
      label: "Đã giao đến nơi",
      eta: "~30 phút tổng cộng",
      detail: "Vui lòng đợi — nguyên liệu đang được giao tới!",
      status: "pending",
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────

/** Animated Savings Hero Badge */
function SavingsBadge({ saved, budget }: { saved: number; budget: number }) {
  const isPositive = saved > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7, y: -20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
      className="relative overflow-hidden rounded-3xl gradient-primary p-6 text-on-primary shadow-xl"
    >
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/8" />
      <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/5" />

      <div className="relative flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Bounce emoji */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          className="text-4xl sm:text-5xl self-start sm:self-auto"
        >
          {isPositive ? "🎉" : "🛒"}
        </motion.div>

        <div className="flex-1">
          {isPositive ? (
            <>
              <p className="text-sm font-semibold text-on-primary/80 mb-1">
                🤖 Trí tuệ tài chính AI
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-1">
                Bạn đã tiết kiệm được {formatVND(saved)}!
              </h2>
              <p className="text-sm text-on-primary/80">
                so với ngân sách {formatVND(budget)} hôm nay khi dùng SmartCart AI 🚀
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-on-primary/80 mb-1">
                🤖 Trí tuệ tài chính AI
              </p>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-1">
                Đơn hàng đang xử lý!
              </h2>
              <p className="text-sm text-on-primary/80">
                Tổng cộng: {formatVND(Math.abs(saved - budget))} từ ngân sách {formatVND(budget)} của bạn.
              </p>
            </>
          )}
        </div>

        {/* Stars burst */}
        {isPositive && (
          <motion.div
            initial={{ opacity: 0, rotate: -20 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.5 }}
            className="flex-shrink-0 hidden sm:flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-white/15 flex items-center justify-center">
              <Star className="w-8 h-8 text-yellow-300 fill-yellow-300" />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

/** Payment method radio card */
function PaymentCard({
  method,
  selected,
  onSelect,
}: {
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      layout
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      id={`payment-${method.id}`}
      role="radio"
      aria-checked={selected}
      className={`
        w-full text-left flex items-center gap-4 p-4 rounded-2xl border-2
        transition-all duration-200 cursor-pointer
        ${selected
          ? `${method.bg} ${method.border} shadow-sm`
          : "bg-surface border-outline-variant hover:border-outline"
        }
      `}
    >
      {/* Icon bubble */}
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${selected ? method.bg : "bg-surface-container"} ${selected ? method.color : "text-on-surface-variant"}`}>
        {method.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-sm font-bold ${selected ? method.color : "text-on-surface"}`}>
            {method.label}
          </span>
          {method.badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${method.bg} ${method.color}`}>
              {method.badge}
            </span>
          )}
        </div>
        <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
          {method.description}
        </p>
      </div>

      {/* Radio indicator */}
      <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${selected ? `border-current ${method.color}` : "border-outline"}`}>
        {selected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-2.5 h-2.5 rounded-full ${method.color.replace("text-", "bg-")}`}
          />
        )}
      </div>
    </motion.button>
  );
}

/** Delivery timeline component */
function DeliveryTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => (
        <motion.div
          key={step.id}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 + index * 0.1 }}
          className="flex gap-4"
        >
          {/* Left: icon + line */}
          <div className="flex flex-col items-center">
            <div
              className={`
                w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 z-10
                transition-all duration-500
                ${step.status === "done"
                  ? "bg-primary text-on-primary shadow-md"
                  : step.status === "active"
                  ? "bg-secondary text-on-secondary shadow-md ring-4 ring-secondary/20"
                  : "bg-surface-container-high text-on-surface-variant"
                }
              `}
            >
              {step.status === "done" ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                step.icon
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-0.5 my-1 flex-1 min-h-[32px] rounded-full transition-colors duration-500 ${
                  step.status === "done" ? "bg-primary/40" : "bg-outline-variant"
                }`}
              />
            )}
          </div>

          {/* Right: content */}
          <div className={`pb-6 flex-1 ${index === steps.length - 1 ? "pb-2" : ""}`}>
            <div className="flex items-baseline justify-between gap-2 mb-0.5">
              <p className={`text-sm font-bold ${
                step.status === "done"
                  ? "text-primary"
                  : step.status === "active"
                  ? "text-secondary"
                  : "text-on-surface-variant"
              }`}>
                {step.label}
              </p>
              <span className={`text-xs flex-shrink-0 font-medium flex items-center gap-1 ${
                step.status === "active" ? "text-secondary" : "text-on-surface-variant"
              }`}>
                <Clock className="w-3 h-3" />
                {step.eta}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {step.detail}
            </p>
            {step.status === "active" && (
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "35%" }}
                transition={{ duration: 2.5, ease: "easeInOut", delay: 0.8 }}
                className="mt-2 h-1 rounded-full bg-secondary/50"
              />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page — Dedicated Checkout Screen
// ─────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const { state, cartTotal, cartItemCount, clearCart } = useAppContext();
  const { cart, userBudget } = state;

  const [selectedPayment, setSelectedPayment] = useState<PaymentId>("momo");
  const [address, setAddress] = useState("123 Đường Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh");
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Money saved = budget - cart total (positive means saved, negative means over)
  const moneySaved = useMemo(() => userBudget - cartTotal, [userBudget, cartTotal]);

  // Unique stores in cart
  const storesInCart = useMemo<StoreType[]>(() => {
    const s = new Set<StoreType>();
    cart.forEach((item) => s.add(item.ingredient.store));
    return Array.from(s);
  }, [cart]);

  const timelineSteps = useMemo(() => buildTimeline(storesInCart), [storesInCart]);

  // ── Order Placed Success screen ──
  if (orderPlaced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-[70vh] flex flex-col items-center justify-center text-center space-y-6 px-4"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-7xl"
        >
          🎊
        </motion.div>
        <div>
          <h1 className="text-3xl font-extrabold text-on-surface mb-2">Đặt hàng thành công!</h1>
          <p className="text-on-surface-variant max-w-xs mx-auto">
            Nguyên liệu của bạn đang được chuẩn bị và sẽ giao đến địa chỉ: <strong>{address}</strong>. Dự kiến giao hàng trong khoảng 30 phút.
          </p>
        </div>
        <div className="rounded-2xl bg-primary-container/30 border border-primary-container px-8 py-4">
          <p className="text-sm text-on-surface-variant mb-1">Tổng số tiền thanh toán qua {paymentMethods.find(p => p.id === selectedPayment)?.label}</p>
          <p className="text-2xl font-extrabold text-primary">{formatVND(cartTotal)}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
          <Link href="/" onClick={clearCart} className="btn-filled flex-1 text-center">
            <Home className="w-4 h-4 mr-2 inline" />
            Quay lại Trang chủ
          </Link>
          <Link href="/meal-plan" className="btn-outlined flex-1 text-center">
            <RotateCcw className="w-4 h-4 mr-2 inline" />
            Lên thực đơn mới
          </Link>
        </div>
      </motion.div>
    );
  }

  // ── Empty cart fallback ──
  if (cart.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center gap-4">
        <ShoppingBag className="w-16 h-16 text-on-surface-variant opacity-20" />
        <p className="text-on-surface-variant">Giỏ hàng của bạn đang trống.</p>
        <Link href="/meal-plan" className="btn-filled">Duyệt công thức</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* ── Back ── */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          href="/grocery-store"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại giỏ hàng
        </Link>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          FINAL SAVINGS BADGE
          ═══════════════════════════════════════════════════════ */}
      <SavingsBadge saved={moneySaved} budget={userBudget} />

      {/* ═══════════════════════════════════════════════════════
          ORDER SUMMARY CHIP ROW
          ═══════════════════════════════════════════════════════ */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex flex-wrap gap-2"
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant text-xs font-semibold text-on-surface">
          <ShoppingBag className="w-3.5 h-3.5 text-primary" />
          {cartItemCount} nguyên liệu
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant text-xs font-semibold text-on-surface">
          <Truck className="w-3.5 h-3.5 text-secondary" />
          {storesInCart.length} cửa hàng
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary-container/50 border border-primary-container text-xs font-semibold text-primary">
          <MapPin className="w-3.5 h-3.5" />
          TP. Hồ Chí Minh
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant text-xs font-semibold text-on-surface">
          <Clock className="w-3.5 h-3.5 text-on-surface-variant" />
          Giao hàng ~30 phút
        </div>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          DELIVERY ADDRESS INPUT (Editable)
          ═══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-surface border border-outline-variant overflow-hidden shadow-[var(--shadow-elevation-1)]"
      >
        <div className="px-5 py-4 border-b border-outline-variant">
          <h2 className="text-base font-extrabold text-on-surface flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Địa chỉ nhận hàng
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Nhập địa chỉ giao hàng chi tiết bên dưới
          </p>
        </div>
        <div className="p-5">
          <input
            id="delivery-address-input"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
            className="w-full px-4 py-3 rounded-2xl border border-outline-variant bg-surface-container text-sm text-on-surface focus:outline-none focus:border-primary transition-all shadow-inner"
          />
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          PAYMENT METHOD SELECTION
          ═══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl bg-surface border border-outline-variant overflow-hidden shadow-[var(--shadow-elevation-1)]"
      >
        <div className="px-5 py-4 border-b border-outline-variant">
          <h2 className="text-base font-extrabold text-on-surface flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            Phương thức thanh toán
          </h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Chọn cách bạn muốn thanh toán cho đơn hàng này
          </p>
        </div>

        <div className="p-4 space-y-3" role="radiogroup" aria-label="Phương thức thanh toán">
          {paymentMethods.map((method) => (
            <PaymentCard
              key={method.id}
              method={method}
              selected={selectedPayment === method.id}
              onSelect={() => setSelectedPayment(method.id)}
            />
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          DELIVERY ETA TIMELINE
          ═══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-2xl bg-surface border border-outline-variant overflow-hidden shadow-[var(--shadow-elevation-1)]"
      >
        <div className="px-5 py-4 border-b border-outline-variant">
          <h2 className="text-base font-extrabold text-on-surface flex items-center gap-2">
            <Bike className="w-5 h-5 text-secondary" />
            Theo dõi giao hàng
          </h2>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <p className="text-xs font-semibold text-secondary">
              Trực tiếp — Dự kiến đến sau 30 phút
            </p>
          </div>
        </div>

        <div className="px-5 pt-5 pb-5">
          <DeliveryTimeline steps={timelineSteps} />
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          ORDER TOTAL & PLACE ORDER
          ═══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl bg-surface border border-outline-variant overflow-hidden shadow-[var(--shadow-elevation-1)]"
      >
        <div className="p-5 space-y-3">
          {/* Line items */}
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Tạm tính</span>
            <span className="font-semibold text-on-surface">{formatVND(cartTotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Phí vận chuyển</span>
            <span className="font-semibold text-primary">Miễn phí</span>
          </div>
          {moneySaved > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-primary flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Tiết kiệm AI
              </span>
              <span className="font-semibold text-primary">−{formatVND(moneySaved)}</span>
            </div>
          )}
          <div className="border-t border-outline-variant pt-3 flex justify-between">
            <span className="text-base font-extrabold text-on-surface">Tổng cộng</span>
            <span className="text-xl font-extrabold text-primary">{formatVND(cartTotal)}</span>
          </div>
        </div>

        {/* Place order CTA */}
        <div className="px-5 pb-5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setOrderPlaced(true)}
            id="place-order-btn"
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl gradient-primary text-on-primary text-base font-extrabold shadow-lg cursor-pointer"
          >
            <PartyPopper className="w-5 h-5" />
            Đặt hàng — {formatVND(cartTotal)}
            <ChevronRight className="w-5 h-5" />
          </motion.button>
          <p className="text-center text-[11px] text-on-surface-variant mt-3">
            Bằng việc đặt hàng, bạn đồng ý với Điều khoản dịch vụ của chúng tôi.
            Thanh toán của bạn được bảo mật và mã hóa.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
