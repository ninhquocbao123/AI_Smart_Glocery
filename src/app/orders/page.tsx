"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  RotateCcw,
  Store,
  Clock,
  MapPin,
  CreditCard,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  Truck,
  XCircle,
  ArrowRight,
  Copy,
  Check,
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import UserPageHeader from "@/components/ui/UserPageHeader";
import { useAppContext } from "@/context/AppContext";
import {
  orderLabels,
  type GroceryOrder,
  type OrderStatus,
  normalizeOrders,
  orderMoney,
  orderItemMoney,
  orderDate,
  reorderItems,
} from "@/lib/orders";
import { formatVND } from "@/lib/priceUtils";

const storeBadgeStyles: Record<string, { bg: string; text: string; border: string }> = {
  "Bach Hoa Xanh": { bg: "bg-emerald-50", text: "text-emerald-800", border: "border-emerald-300" },
  Winmart: { bg: "bg-amber-50", text: "text-amber-800", border: "border-amber-300" },
  "Coop Food": { bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-300" },
};

const statusConfig: Record<
  string,
  { label: string; bg: string; text: string; border: string; step: number; icon: typeof CheckCircle2 }
> = {
  unpaid: {
    label: "Chưa thanh toán",
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-300",
    step: 1,
    icon: AlertCircle,
  },
  confirmed: {
    label: "Đang chuẩn bị",
    bg: "bg-purple-50",
    text: "text-purple-800",
    border: "border-purple-300",
    step: 2,
    icon: Clock,
  },
  delivering: {
    label: "Đang giao hàng",
    bg: "bg-blue-50",
    text: "text-blue-800",
    border: "border-blue-300",
    step: 3,
    icon: Truck,
  },
  delivered: {
    label: "Đã giao đến nơi",
    bg: "bg-teal-50",
    text: "text-teal-800",
    border: "border-teal-300",
    step: 3,
    icon: Truck,
  },
  received: {
    label: "Giao thành công",
    bg: "bg-emerald-50",
    text: "text-emerald-800",
    border: "border-emerald-300",
    step: 4,
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Đã hủy đơn",
    bg: "bg-rose-50",
    text: "text-rose-800",
    border: "border-rose-300",
    step: 0,
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<GroceryOrder[]>([]);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const { addMultipleToCart } = useAppContext();
  const router = useRouter();
  const [paymentNotice, setPaymentNotice] = useState("");
  const [receiveId, setReceiveId] = useState("");
  const [syncError, setSyncError] = useState("");

  const toggleExpand = (id: string) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyOrderId = (id: string) => {
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  useEffect(() => {
    if (busy || loading) return;
    const controller = new AbortController();
    let fetching = false;

    async function refresh() {
      if (document.visibilityState !== "visible" || fetching) return;
      fetching = true;
      try {
        const response = await fetch("/api/orders", {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw Error(data.message || "Chưa cập nhật được trạng thái đơn hàng.");
        if (!controller.signal.aborted) {
          setOrders(normalizeOrders(data.orders));
          setSyncError("");
        }
      } catch (e) {
        if (!controller.signal.aborted) {
          setSyncError(e instanceof Error ? e.message : "Chưa cập nhật được trạng thái đơn hàng.");
        }
      } finally {
        fetching = false;
      }
    }

    const timer = setInterval(() => void refresh(), 15000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [busy, loading]);

  useEffect(() => {
    let active = true;
    async function reconcileReturn() {
      const params = new URLSearchParams(window.location.search);
      if (params.get("payment") === "unavailable") {
        if (active)
          setPaymentNotice(
            "Đơn đã được lưu nhưng chưa mở được cổng thanh toán. Hãy dùng nút kiểm tra trạng thái hoặc thanh toán trong đơn bên dưới.",
          );
      }
      const orderId = params.get("paymentOrder");
      if (!orderId || orderId.length > 100) return;
      if (active) setPaymentNotice("Đang xác minh giao dịch với cổng thanh toán…");
      try {
        const response = await fetch("/api/payments", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, action: "check" }),
        });
        const data = await response.json();
        if (!response.ok) throw Error(data.message || "Chưa xác minh được thanh toán.");
        if (active)
          setPaymentNotice(
            data.paid
              ? "Cổng thanh toán đã xác nhận giao dịch thành công."
              : "Chưa nhận được xác nhận thanh toán. Nếu bạn đã chuyển tiền, hãy bấm Kiểm tra trạng thái.",
          );
      } catch (e) {
        if (active) setPaymentNotice(e instanceof Error ? e.message : "Chưa xác minh được thanh toán.");
      }
    }

    reconcileReturn()
      .then(() => fetch("/api/orders"))
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.message);
        if (active) setOrders(normalizeOrders(d.orders));
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function update(order: GroceryOrder, action: string) {
    setBusy(order.orderId);
    setError("");
    try {
      const r = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.orderId, action }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.message);
      setOrders((prev) =>
        prev.map((o) => (o.orderId === order.orderId ? normalizeOrders([d.order])[0] ?? o : o)),
      );
      setReceiveId("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
    } finally {
      setBusy("");
    }
  }

  async function pay(order: GroceryOrder, action = "create") {
    if (order.paymentMethod === "bank" && action === "create") {
      router.push("/payment/" + encodeURIComponent(order.orderId));
      return;
    }
    setBusy(order.orderId);
    setError("");
    try {
      const r = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId, action }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.message);
      if (d.checkoutUrl) {
        window.location.assign(d.checkoutUrl);
        return;
      }
      if (d.order)
        setOrders((prev) =>
          prev.map((o) => (o.orderId === order.orderId ? normalizeOrders([d.order])[0] ?? o : o)),
        );
      if (!d.paid) setError("Cổng thanh toán chưa xác nhận nhận tiền. Bạn có thể kiểm tra lại sau.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể mở thanh toán.");
    } finally {
      setBusy("");
    }
  }

  const list = orders.filter((o) => filter === "all" || o.status === filter);

  // Statistics
  const totalOrders = orders.length;
  const inProgressOrders = orders.filter((o) =>
    ["unpaid", "confirmed", "delivering", "delivered"].includes(o.status),
  ).length;
  const completedSpend = orders
    .filter((o) => (o.status as string) === "completed" || (o.status as string) === "received" || o.paymentStatus === "paid")
    .reduce((sum, o) => sum + (o.total ?? 0), 0);

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      <UserPageHeader
        eyebrow="QUẢN LÝ MUA SẮM"
        title="Theo dõi & Lịch sử đơn hàng"
        description="Thông tin đơn hàng được phân chia rõ ràng theo từng bước xử lý, minh bạch chi phí nguyên liệu và phí giao hàng."
        action={
          <Link
            href="/meal-plan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-bold text-sm text-slate-700 transition-all shadow-sm"
          >
            <ShoppingBag size={16} className="text-emerald-700" />
            <span>Tiếp tục chọn món</span>
            <ArrowRight size={14} />
          </Link>
        }
      />

      {/* ── 3 Summary KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center shrink-0">
            <Package size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Tổng số đơn đã đặt
            </span>
            <strong className="text-2xl font-black text-slate-900 mt-0.5 block">
              {totalOrders} đơn
            </strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shrink-0">
            <Truck size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Đơn đang xử lý & giao
            </span>
            <strong className="text-2xl font-black text-blue-700 mt-0.5 block">
              {inProgressOrders} đơn
            </strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center shrink-0">
            <CreditCard size={24} />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Chi tiêu thành công
            </span>
            <strong className="text-2xl font-black text-slate-900 mt-0.5 block">
              {formatVND(completedSpend)}
            </strong>
          </div>
        </div>
      </div>

      {paymentNotice && (
        <div
          role="status"
          className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-sm font-semibold text-emerald-900 flex items-center gap-3 shadow-sm animate-fadeIn"
        >
          <CheckCircle2 size={18} className="text-emerald-700 shrink-0" />
          <span>{paymentNotice}</span>
        </div>
      )}

      {/* ── Filter Tabs Bar ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 sm:p-4 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-hide">
        {(
          [["all", "Tất cả đơn"], ...Object.entries(orderLabels)] as [OrderStatus | "all", string][]
        ).map(([id, label]) => {
          const count = orders.filter((o) => id === "all" || o.status === id).length;
          const isActive = filter === id;
          return (
            <button
              key={id}
              onClick={() => setFilter(id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{label}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-black ${
                  isActive ? "bg-white/25 text-white" : "bg-slate-200 text-slate-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm font-medium">
          {error}
        </p>
      )}

      {syncError && (
        <p role="status" className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-200 text-xs font-semibold">
          {syncError} Hệ thống sẽ tự động thử lại sau ít giây.
        </p>
      )}

      {/* ── Orders Listing ── */}
      {loading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-sm">
          Đang tải dữ liệu đơn hàng…
        </div>
      ) : !list.length ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-14 text-center max-w-lg mx-auto shadow-sm">
          <Package className="w-16 h-16 mx-auto mb-4 text-slate-300" />
          <h2 className="text-lg font-bold text-slate-800">Không tìm thấy đơn hàng</h2>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            Chưa có đơn hàng nào trong trạng thái này. Khám phá các công thức món ngon để lên giỏ nguyên liệu ngay!
          </p>
          <Link
            href="/meal-plan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all"
          >
            <span>Khám phá món Việt</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {list.map((o) => {
            const statusInfo = statusConfig[o.status] || {
              label: orderLabels[o.status] || o.status,
              bg: "bg-slate-100",
              text: "text-slate-700",
              border: "border-slate-200",
              step: 1,
              icon: Package,
            };
            const StatusIcon = statusInfo.icon;
            const storeStyle = storeBadgeStyles[o.store] || {
              bg: "bg-slate-100",
              text: "text-slate-800",
              border: "border-slate-200",
            };
            const isExpanded = !!expandedOrders[o.orderId];
            const currentStep = statusInfo.step;
            const shortId = o.orderId.slice(0, 12).toUpperCase();

            return (
              <article
                key={o.orderId}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* ── 1. Order Card Header ── */}
                <div className="p-5 sm:p-6 bg-slate-50/70 border-b border-slate-200/90 flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <div className="inline-flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-2xs">
                        <span className="font-mono text-xs font-black text-slate-900 tracking-wide">
                          #{shortId}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyOrderId(o.orderId)}
                          className="text-slate-400 hover:text-slate-700 ml-1 transition-colors"
                          title="Sao chép toàn bộ mã đơn"
                        >
                          {copiedId === o.orderId ? (
                            <Check size={13} className="text-emerald-600" />
                          ) : (
                            <Copy size={13} />
                          )}
                        </button>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-2.5 py-1 rounded-lg border ${storeStyle.bg} ${storeStyle.text} ${storeStyle.border}`}
                      >
                        <Store size={13} />
                        {o.store}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={13} />
                        {orderDate(o.createdAt, true)}
                      </span>
                      <span>•</span>
                      <span className="font-bold text-slate-700">
                        {o.mode === "live"
                          ? o.paymentStatus === "paid"
                            ? "Đã thanh toán"
                            : o.paymentStatus === "review"
                            ? "Cần kiểm tra giao dịch"
                            : "Chưa thanh toán"
                          : "Đơn chạy thử nghiệm"}
                      </span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-1.5 rounded-full border shadow-2xs ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
                    >
                      <StatusIcon size={14} />
                      {statusInfo.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">
                      {o.items.length} mặt hàng
                    </span>
                  </div>
                </div>

                {/* ── 2. Visual Order Progress Stepper (Except Cancelled) ── */}
                {o.status !== "cancelled" && (
                  <div className="px-5 sm:px-6 pt-5 pb-3 bg-white border-b border-slate-100">
                    <div className="flex items-center justify-between relative">
                      {/* Stepper background track */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0" />
                      {/* Active track */}
                      <div
                        className="absolute top-1/2 left-0 h-1 bg-emerald-600 -translate-y-1/2 z-0 transition-all duration-500"
                        style={{
                          width: `${((Math.max(1, currentStep) - 1) / 3) * 100}%`,
                        }}
                      />

                      {/* Step 1: Đặt hàng */}
                      <div className="relative z-10 flex flex-col items-center gap-1 bg-white px-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                          ✓
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">Đặt hàng</span>
                      </div>

                      {/* Step 2: Chuẩn bị */}
                      <div className="relative z-10 flex flex-col items-center gap-1 bg-white px-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                            currentStep >= 2
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}
                        >
                          {currentStep >= 2 ? "✓" : "2"}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">Chuẩn bị</span>
                      </div>

                      {/* Step 3: Đang giao */}
                      <div className="relative z-10 flex flex-col items-center gap-1 bg-white px-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                            currentStep >= 3
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}
                        >
                          {currentStep >= 3 ? "✓" : "3"}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">Đang giao</span>
                      </div>

                      {/* Step 4: Hoàn thành */}
                      <div className="relative z-10 flex flex-col items-center gap-1 bg-white px-2">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                            currentStep === 4
                              ? "bg-emerald-600 text-white"
                              : "bg-slate-100 text-slate-400 border border-slate-200"
                          }`}
                        >
                          {currentStep === 4 ? "✓" : "4"}
                        </div>
                        <span className="text-[11px] font-bold text-slate-700">Nhận hàng</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── 3. Order Body: Items Breakdown & Delivery Details ── */}
                <div className="p-5 sm:p-6 grid lg:grid-cols-12 gap-6 items-start">
                  {/* Left: Ingredients list (7 cols) */}
                  <div className="lg:col-span-7 space-y-3">
                    <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                      <span>Danh sách nguyên liệu ({o.items.length})</span>
                      <span className="text-slate-400 lowercase font-medium">theo thực đơn</span>
                    </h3>

                    {/* Table-like preview */}
                    <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 bg-slate-50/50 text-xs">
                      {(isExpanded ? o.items : o.items.slice(0, 3)).map((item, idx) => (
                        <div key={idx} className="p-3 flex items-center justify-between gap-3">
                          <div className="flex-1">
                            <span className="font-bold text-slate-800 block text-sm">
                              {item.ingredient.name}
                            </span>
                            <span className="text-slate-500 text-[11px]">
                              Số lượng: {item.quantity ?? 1} {item.ingredient.unit}
                            </span>
                          </div>
                          <span className="font-extrabold text-slate-800 text-sm">
                            {orderItemMoney(item)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Expand/Collapse Button */}
                    {o.items.length > 3 && (
                      <button
                        type="button"
                        onClick={() => toggleExpand(o.orderId)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1 pt-1 cursor-pointer"
                      >
                        {isExpanded ? (
                          <>
                            <span>Thu gọn danh sách</span>
                            <ChevronUp size={14} />
                          </>
                        ) : (
                          <>
                            <span>Xem thêm {o.items.length - 3} nguyên liệu khác</span>
                            <ChevronDown size={14} />
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Right: Shipping & Payment Info (5 cols) */}
                  <div className="lg:col-span-5 bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs space-y-3">
                    <h3 className="font-extrabold text-slate-700 uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
                      Thông tin giao nhận & thanh toán
                    </h3>

                    <div className="space-y-2 text-slate-600">
                      <div className="flex items-start gap-2">
                        <MapPin size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-bold">Địa chỉ giao:</strong>
                          <span className="leading-relaxed">{o.address || "Giao tận nơi"}</span>
                        </div>
                      </div>

                      <div className="flex items-start gap-2 pt-1 border-t border-slate-200/60">
                        <CreditCard size={15} className="text-emerald-700 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-slate-900 block font-bold">Hình thức trả tiền:</strong>
                          <span>
                            {o.paymentMethod === "cod"
                              ? "Tiền mặt khi nhận hàng (COD)"
                              : o.paymentMethod === "momo"
                              ? "Ví điện tử MoMo"
                              : "Chuyển khoản QR ngân hàng"}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between pt-2 border-t border-slate-200/60 font-semibold">
                        <span>Phí giao hàng:</span>
                        <span className="text-slate-800">{orderMoney(o.deliveryFee)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── 4. Order Card Footer: Price & Actions ── */}
                <div className="p-5 sm:p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between flex-wrap gap-4">
                  {/* Total Amount */}
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">
                      Tổng tiền thanh toán
                    </span>
                    <strong className="text-2xl sm:text-3xl font-black text-emerald-800 leading-none">
                      {orderMoney(o.total)}
                    </strong>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Reorder Button */}
                    <button
                      type="button"
                      disabled={!reorderItems(o)}
                      onClick={() => {
                        const refreshed = reorderItems(o);
                        if (!refreshed) return;
                        addMultipleToCart(refreshed);
                        router.push("/grocery-store");
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-40"
                    >
                      <RotateCcw size={14} />
                      <span>Mua lại đơn này</span>
                    </button>

                    {/* Unpaid Actions */}
                    {o.status === "unpaid" && ["bank", "momo"].includes(o.paymentMethod) && (
                      <>
                        <button
                          type="button"
                          disabled={!!busy}
                          onClick={() => pay(o)}
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          Thanh toán {o.paymentMethod === "momo" ? "MoMo" : "QR ngân hàng"}
                        </button>
                        <button
                          type="button"
                          disabled={!!busy}
                          onClick={() => pay(o, "check")}
                          className="px-3.5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Kiểm tra thanh toán
                        </button>
                      </>
                    )}

                    {/* Confirm Receive Button */}
                    {["delivering", "delivered"].includes(o.status) && (
                      <button
                        type="button"
                        disabled={!!busy}
                        onClick={() => setReceiveId(o.orderId)}
                        className="px-4 py-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                      >
                        Đã nhận đủ hàng
                      </button>
                    )}

                    {/* Cancel Order Button */}
                    {["unpaid", "confirmed"].includes(o.status) &&
                      !o.paymentStarted &&
                      o.paymentStatus !== "paid" && (
                        <button
                          type="button"
                          disabled={!!busy}
                          onClick={() => update(o, "cancel")}
                          className="px-3.5 py-2.5 text-rose-600 hover:bg-rose-50 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Hủy đơn
                        </button>
                      )}
                  </div>
                </div>

                {/* Confirm Receive Modal Box */}
                {receiveId === o.orderId && (
                  <div className="p-4 bg-emerald-50/90 border-t border-emerald-200 flex items-center justify-between flex-wrap gap-3">
                    <p className="text-xs font-bold text-emerald-950">
                      Bạn xác nhận đã nhận đủ nguyên liệu của đơn hàng #{shortId}?
                    </p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={!!busy}
                        onClick={() => void update(o, "receive")}
                        className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm"
                      >
                        {busy ? "Đang lưu…" : "Xác nhận hoàn tất"}
                      </button>
                      <button
                        type="button"
                        disabled={!!busy}
                        onClick={() => setReceiveId("")}
                        className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold"
                      >
                        Chưa nhận
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
