"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import Link from "next/link";
import {
  Package,
  RefreshCw,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Calendar,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  Receipt,
  X,
  CreditCard,
  Copy,
  Check,
  Info,
  Store as StoreIcon,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import {
  normalizeOrders,
  orderLabels,
  orderDate,
  orderMoney,
  orderItemMoney,
  type OrderStatus,
} from "@/lib/orders";

type OrderRow = ReturnType<typeof normalizeOrders>[number] & {
  phone?: string;
  branch?: string;
  fulfillment?: { shippedAt?: string; deliveredAt?: string; receivedAt?: string };
};

type Action = {
  order: OrderRow;
  status?: "delivering" | "delivered";
  action?: "confirmCod";
};

const paymentLabels: Record<string, string> = {
  paid: "Đã thanh toán",
  pending: "Chưa thanh toán",
  cod: "Thu tiền COD",
  review: "Cần đối soát",
  failed: "Thanh toán thất bại",
};

const statusConfigs: Record<string, { label: string; bg: string; icon: typeof CheckCircle2 }> = {
  confirmed: {
    label: "Chờ chuẩn bị",
    bg: "bg-amber-50 text-amber-800 border-amber-200",
    icon: Clock,
  },
  delivering: {
    label: "Đang giao hàng",
    bg: "bg-blue-50 text-blue-800 border-blue-200",
    icon: Truck,
  },
  delivered: {
    label: "Đã giao hàng",
    bg: "bg-purple-50 text-purple-800 border-purple-200",
    icon: CheckCircle2,
  },
  completed: {
    label: "Hoàn tất",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Đã hủy",
    bg: "bg-rose-50 text-rose-800 border-rose-200",
    icon: X,
  },
  unpaid: {
    label: "Chưa thanh toán",
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Clock,
  },
  unknown: {
    label: "Chưa rõ trạng thái",
    bg: "bg-slate-100 text-slate-700 border-slate-200",
    icon: Info,
  },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [status, setStatus] = useState("confirmed");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [revision, setRevision] = useState(0);
  const [confirmation, setConfirmation] = useState<Action | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Record<string, boolean>>({});

  const lock = useRef(false);

  useEffect(() => {
    if (busy) return;
    const controller = new AbortController();
    let fetching = false;

    async function refresh() {
      if (fetching) return;
      fetching = true;
      try {
        const params = new URLSearchParams({ status, q: query, page: String(page) });
        const response = await fetch(`/api/admin/orders?${params}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Không tải được danh sách đơn hàng.");
        if (controller.signal.aborted) return;
        setOrders(normalizeOrders(data.orders));
        setTotal(data.total);
        setPages(data.pages);
        if (page > data.pages) setPage(data.pages);
        setError("");
      } catch (e) {
        if (!controller.signal.aborted) {
          setError(e instanceof Error ? e.message : "Không tải được đơn hàng.");
        }
      } finally {
        fetching = false;
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void refresh();
    const visibleRefresh = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    const timer = setInterval(visibleRefresh, 15000);
    document.addEventListener("visibilitychange", visibleRefresh);
    return () => {
      controller.abort();
      clearInterval(timer);
      document.removeEventListener("visibilitychange", visibleRefresh);
    };
  }, [status, query, page, revision, busy]);

  async function execute() {
    if (!confirmation || lock.current) return;
    lock.current = true;
    setBusy(true);
    setActionError("");
    setNotice("");
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: confirmation.order.orderId,
          status: confirmation.status,
          action: confirmation.action,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Chưa cập nhật được đơn hàng.");
      setNotice(
        `Đơn ${confirmation.order.orderId}: ${
          confirmation.action
            ? "Đã xác nhận thu tiền COD thành công"
            : orderLabels[confirmation.status!]
        }.`
      );
      setConfirmation(null);
    } catch (e) {
      setActionError(e instanceof Error ? e.message : "Không cập nhật được đơn hàng.");
      setConfirmation(null);
    } finally {
      lock.current = false;
      setBusy(false);
      setRevision((v) => v + 1);
    }
  }

  const copyOrderId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrders((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  };

  // Status Counts from loaded batch (for visual assistance)
  const stats = useMemo(() => {
    const s = {
      confirmed: 0,
      delivering: 0,
      delivered: 0,
      completed: 0,
    };
    orders.forEach((o) => {
      if (o.status === "confirmed") s.confirmed++;
      else if (o.status === "delivering") s.delivering++;
      else if (o.status === "delivered") s.delivered++;
      else if (o.status === "completed") s.completed++;
    });
    return s;
  }, [orders]);

  const statusTabs = [
    { key: "all", label: "Tất cả đơn", color: "bg-slate-100 text-slate-700" },
    { key: "confirmed", label: "Chờ chuẩn bị", color: "bg-amber-100 text-amber-800" },
    { key: "delivering", label: "Đang giao", color: "bg-blue-100 text-blue-800" },
    { key: "delivered", label: "Đã giao hàng", color: "bg-purple-100 text-purple-800" },
    { key: "completed", label: "Hoàn tất", color: "bg-emerald-100 text-emerald-800" },
    { key: "unpaid", label: "Chưa thanh toán", color: "bg-slate-100 text-slate-700" },
    { key: "cancelled", label: "Đã hủy", color: "bg-rose-100 text-rose-800" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-100/70 text-emerald-800">
              <ShoppingBag size={12} />
              Vận hành cửa hàng & Giao nhận
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Tự động cập nhật 15s
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Quản lý đơn hàng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Điều phối quy trình: Tiếp nhận → Chuẩn bị hàng → Đang giao → Đã giao → Xác nhận COD & Khách nhận.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setLoading(true);
              setRevision((v) => v + 1);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={15} className={loading ? "animate-spin text-emerald-600" : ""} />
            Tải lại
          </button>

          <Link
            href="/admin/operations"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-900 transition-colors shadow-sm"
          >
            <SlidersHorizontal size={15} />
            Quản trị vận hành
          </Link>
        </div>
      </div>

      {/* ── KPI Summary Cards ───────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Tổng đơn phù hợp */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Đơn hàng trong bộ lọc</span>
            <span className="p-2 rounded-xl bg-slate-100 text-slate-700">
              <Package size={18} />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">{total}</p>
          <p className="text-xs text-slate-400 mt-1">
            Trang {page}/{pages}
          </p>
        </div>

        {/* Card 2: Chờ chuẩn bị */}
        <div
          onClick={() => {
            setStatus("confirmed");
            setPage(1);
          }}
          className={`rounded-2xl border p-5 shadow-sm cursor-pointer transition ${
            status === "confirmed"
              ? "border-amber-400 bg-amber-50/50 ring-2 ring-amber-300/30"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Chờ chuẩn bị hàng</span>
            <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Clock size={18} />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-900 mt-2">
            {stats.confirmed}
          </p>
          <p className="text-xs text-slate-400 mt-1">Cần chuẩn bị & bố trí shipper</p>
        </div>

        {/* Card 3: Đang giao hàng */}
        <div
          onClick={() => {
            setStatus("delivering");
            setPage(1);
          }}
          className={`rounded-2xl border p-5 shadow-sm cursor-pointer transition ${
            status === "delivering"
              ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-300/30"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Đang trên đường giao</span>
            <span className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Truck size={18} />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-900 mt-2">
            {stats.delivering}
          </p>
          <p className="text-xs text-slate-400 mt-1">Shipper đang di chuyển</p>
        </div>

        {/* Card 4: Đã giao / Hoàn thành */}
        <div
          onClick={() => {
            setStatus("delivered");
            setPage(1);
          }}
          className={`rounded-2xl border p-5 shadow-sm cursor-pointer transition ${
            status === "delivered" || status === "completed"
              ? "border-emerald-400 bg-emerald-50/50 ring-2 ring-emerald-300/30"
              : "border-slate-200 bg-white hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Đã giao & Hoàn thành</span>
            <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 size={18} />
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-900 mt-2">
            {stats.delivered + stats.completed}
          </p>
          <p className="text-xs text-slate-400 mt-1">Bàn giao thành công</p>
        </div>
      </div>

      {/* ── Search and Status Filter Section ────────────────── */}
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm space-y-4">
        {/* Search form */}
        <form
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
          onSubmit={(e) => {
            e.preventDefault();
            setLoading(true);
            setQuery(search.trim());
            setPage(1);
            setRevision((v) => v + 1);
          }}
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-3.5 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              maxLength={100}
              placeholder="Tìm theo mã đơn hàng, số điện thoại hoặc địa chỉ khách…"
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-10 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setQuery("");
                  setPage(1);
                  setRevision((v) => v + 1);
                }}
                className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-900 transition-colors shadow-sm shrink-0"
          >
            <Search size={16} />
            Tìm kiếm
          </button>
        </form>

        {/* Filter Pills */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Lọc trạng thái:
            </span>
            {statusTabs.map((tab) => {
              const active = status === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => {
                    setStatus(tab.key);
                    setPage(1);
                    setLoading(true);
                    setRevision((v) => v + 1);
                  }}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    active
                      ? "bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600/30"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                  }`}
                >
                  {tab.label}
                  {active && (
                    <span className="w-1.5 h-1.5 rounded-full bg-white ml-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Status Alerts ──────────────────────────────────── */}
      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium shadow-sm"
        >
          <AlertCircle size={20} className="text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {actionError && (
        <div
          role="alert"
          className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-medium shadow-sm"
        >
          <AlertCircle size={20} className="text-rose-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-medium shadow-sm"
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={20} className="text-emerald-700 shrink-0" />
            <span>{notice}</span>
          </div>
          <button
            type="button"
            onClick={() => setNotice("")}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold"
          >
            Đóng
          </button>
        </div>
      )}

      {/* ── Confirmation Modal Dialog ──────────────────────── */}
      {confirmation && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-5 animate-in fade-in zoom-in-95"
          >
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2.5 rounded-2xl ${
                    confirmation.action
                      ? "bg-amber-100 text-amber-800"
                      : confirmation.status === "delivering"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}
                >
                  {confirmation.action ? (
                    <Receipt size={22} />
                  ) : confirmation.status === "delivering" ? (
                    <Truck size={22} />
                  ) : (
                    <CheckCircle2 size={22} />
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {confirmation.action
                      ? "Xác nhận đã thu tiền COD?"
                      : confirmation.status === "delivering"
                      ? "Bắt đầu giao đơn hàng?"
                      : "Xác nhận đã giao hàng?"}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    {confirmation.order.orderId}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmation(null)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4 space-y-2 text-xs sm:text-sm text-slate-700">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{confirmation.order.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400 shrink-0" />
                <span>{confirmation.order.phone || "Chưa có số điện thoại"}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                <span>Tổng tiền cần thu:</span>
                <span className="text-base text-emerald-800">
                  {orderMoney(confirmation.order.total)}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {confirmation.action
                ? `Chỉ xác nhận sau khi shipper đã thu đủ số tiền ${orderMoney(
                    confirmation.order.total
                  )} từ khách hàng. Trạng thái thanh toán sẽ đổi sang "Đã thanh toán".`
                : confirmation.status === "delivering"
                ? "Trạng thái đơn hàng sẽ cập nhật 'Đang giao' và thông báo ngay lập tức tới khách hàng trên ứng dụng."
                : "Chỉ đánh dấu khi shipper đã hoàn tất việc bàn giao hàng tận tay khách. Khách hàng sẽ nhận thông báo để xác nhận nhận hàng."}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => setConfirmation(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition"
              >
                Quay lại
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void execute()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-800 text-white text-sm font-bold hover:bg-emerald-900 transition shadow-sm disabled:opacity-50"
              >
                {busy && <RefreshCw size={15} className="animate-spin" />}
                {busy ? "Đang lưu…" : "Xác nhận thực hiện"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Order List ─────────────────────────────────────── */}
      {loading ? (
        <div className="py-20 text-center rounded-2xl border border-slate-200 bg-white shadow-sm space-y-3">
          <RefreshCw size={28} className="animate-spin text-emerald-700 mx-auto" />
          <p className="text-sm font-bold text-slate-700">Đang tải danh sách đơn hàng…</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-16 text-center shadow-sm">
          <Package size={44} className="mx-auto mb-3 text-slate-300" />
          <h2 className="text-lg font-bold text-slate-800">Không có đơn hàng phù hợp</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-sm mx-auto">
            Không tìm thấy đơn hàng nào ở trạng thái này hoặc khớp với từ khóa tìm kiếm.
          </p>
          <button
            type="button"
            onClick={() => {
              setStatus("all");
              setSearch("");
              setQuery("");
              setPage(1);
            }}
            className="mt-4 px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            Xem tất cả đơn hàng
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>
              Hiển thị <strong>{orders.length}</strong> / <strong>{total}</strong> đơn hàng phù hợp
            </span>
            <span>
              Trang {page} trên {pages}
            </span>
          </div>

          {orders.map((order) => {
            const eligible =
              order.paymentStatus === "paid" ||
              (order.paymentMethod === "cod" && order.paymentStatus === "cod");

            const isExpanded = Boolean(expandedOrders[order.orderId]);
            const statusConfig = statusConfigs[order.status] || statusConfigs.unknown;
            const StatusIcon = statusConfig.icon;

            return (
              <article
                key={order.orderId}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
              >
                {/* 1. Header Bar: Order ID, badges, price */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyOrderId(order.orderId)}
                        className="group inline-flex items-center gap-1.5 font-mono font-bold text-sm sm:text-base text-slate-900 hover:text-emerald-800"
                        title="Bấm để sao chép mã đơn"
                      >
                        <span>{order.orderId}</span>
                        {copiedId === order.orderId ? (
                          <Check size={14} className="text-emerald-600" />
                        ) : (
                          <Copy
                            size={14}
                            className="text-slate-400 group-hover:text-emerald-700 transition"
                          />
                        )}
                      </button>

                      {/* Store & Branch Pill */}
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                        <StoreIcon size={12} className="text-slate-500" />
                        {order.store}
                        {order.branch ? ` · ${order.branch}` : ""}
                      </span>

                      {/* Demo Mode Badge */}
                      {order.mode === "demo" && (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-100/70 text-amber-900 text-[11px] font-bold">
                          Đơn thử nghiệm
                        </span>
                      )}
                    </div>

                    {/* Order Time and Payment details */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="inline-flex items-center gap-1">
                        <Calendar size={13} className="text-slate-400" />
                        {orderDate(order.createdAt)}
                      </span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1">
                        <CreditCard size={13} className="text-slate-400" />
                        {order.paymentMethod === "bank"
                          ? "Chuyển khoản QR ngân hàng"
                          : order.paymentMethod.toUpperCase()}
                      </span>
                      <span>·</span>
                      <span
                        className={`font-semibold ${
                          order.paymentStatus === "paid"
                            ? "text-emerald-700"
                            : order.paymentStatus === "cod"
                            ? "text-blue-700"
                            : order.paymentStatus === "review"
                            ? "text-amber-700"
                            : "text-slate-600"
                        }`}
                      >
                        {paymentLabels[order.paymentStatus || ""] || "Chưa rõ thanh toán"}
                      </span>
                    </div>
                  </div>

                  {/* Right side: Status badge & Total Price */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.bg}`}
                    >
                      <StatusIcon size={13} />
                      {statusConfig.label}
                    </span>
                    <p className="font-extrabold text-xl sm:text-2xl text-emerald-800">
                      {orderMoney(order.total)}
                    </p>
                  </div>
                </div>

                {/* 2. Customer & Address Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Địa chỉ nhận hàng
                      </span>
                      <span className="text-slate-800 font-medium block mt-0.5">
                        {order.address}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <Phone size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Số điện thoại liên hệ
                      </span>
                      {order.phone ? (
                        <a
                          href={`tel:${order.phone}`}
                          className="text-emerald-800 font-bold hover:underline block mt-0.5"
                        >
                          {order.phone}
                        </a>
                      ) : (
                        <span className="text-slate-400 italic block mt-0.5">
                          Chưa có số điện thoại
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Items Accordion */}
                <div className="border border-slate-100 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleExpand(order.orderId)}
                    className="w-full flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 text-xs sm:text-sm font-semibold text-slate-700 transition"
                  >
                    <div className="flex items-center gap-2">
                      <Package size={15} className="text-emerald-700" />
                      <span>Danh mục thực đơn & nguyên liệu ({order.items.length} món)</span>
                    </div>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-white border-t border-slate-100 space-y-3">
                      <ul className="divide-y divide-slate-100">
                        {order.items.map((item, index) => (
                          <li
                            key={index}
                            className="py-2.5 flex items-center justify-between gap-3 text-xs sm:text-sm"
                          >
                            <div>
                              <span className="font-bold text-slate-800">
                                {item.ingredient.name}
                              </span>
                              <p className="text-xs text-slate-400 mt-0.5">
                                {item.quantity ?? "—"} {item.ingredient.unit} · Cho món:{" "}
                                <strong className="text-slate-600 font-semibold">
                                  {item.recipeTitle}
                                </strong>
                              </p>
                            </div>
                            <span className="font-semibold text-slate-900 whitespace-nowrap">
                              {orderItemMoney(item)}
                            </span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span>Phí vận chuyển giao hàng (đã tính trong tổng tiền):</span>
                        <strong className="text-slate-700 font-bold">
                          {orderMoney(order.deliveryFee)}
                        </strong>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4. Fulfillment Milestones */}
                {(order.fulfillment?.shippedAt ||
                  order.fulfillment?.deliveredAt ||
                  order.fulfillment?.receivedAt) && (
                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-400 uppercase tracking-wider">
                      Mốc thời gian:
                    </span>
                    {order.fulfillment?.shippedAt && (
                      <span className="inline-flex items-center gap-1">
                        <Truck size={12} className="text-blue-600" />
                        Bắt đầu giao: {orderDate(order.fulfillment.shippedAt)}
                      </span>
                    )}
                    {order.fulfillment?.deliveredAt && (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-purple-600" />
                        Đã giao hàng: {orderDate(order.fulfillment.deliveredAt)}
                      </span>
                    )}
                    {order.fulfillment?.receivedAt && (
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 size={12} className="text-emerald-600" />
                        Khách đã nhận: {orderDate(order.fulfillment.receivedAt)}
                      </span>
                    )}
                  </div>
                )}

                {/* 5. Action Buttons & Operational Status */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === "confirmed" && eligible && (
                      <button
                        type="button"
                        disabled={busy || !!confirmation}
                        onClick={() => setConfirmation({ order, status: "delivering" })}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-bold shadow-sm transition disabled:opacity-50"
                      >
                        <Truck size={16} />
                        Bắt đầu giao hàng
                      </button>
                    )}

                    {order.status === "delivering" && eligible && (
                      <button
                        type="button"
                        disabled={busy || !!confirmation}
                        onClick={() => setConfirmation({ order, status: "delivered" })}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold shadow-sm transition disabled:opacity-50"
                      >
                        <CheckCircle2 size={16} />
                        Xác nhận đã giao hàng
                      </button>
                    )}

                    {["delivered", "completed"].includes(order.status) &&
                      order.paymentMethod === "cod" &&
                      order.paymentStatus === "cod" && (
                        <button
                          type="button"
                          disabled={busy || !!confirmation}
                          onClick={() => setConfirmation({ order, action: "confirmCod" })}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs sm:text-sm font-bold shadow-sm transition disabled:opacity-50"
                        >
                          <Receipt size={16} />
                          Xác nhận đã thu tiền COD
                        </button>
                      )}
                  </div>

                  {/* Informational hints */}
                  <div className="text-xs">
                    {order.status === "delivered" && (
                      <span className="text-slate-500 italic">
                        Đang chờ khách hàng xác nhận nhận hàng trên ứng dụng.
                      </span>
                    )}
                    {order.status === "completed" && (
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-bold">
                        <CheckCircle2 size={14} />
                        Đơn hàng đã hoàn tất trọn vẹn
                      </span>
                    )}
                    {!eligible && ["unpaid", "confirmed", "delivering"].includes(order.status) && (
                      <span className="inline-flex items-center gap-1 text-amber-800 font-medium">
                        <AlertCircle size={14} />
                        {order.paymentStatus === "review"
                          ? "Cần đối soát giao dịch trước khi giao."
                          : "Chờ xác nhận thanh toán trước khi giao hàng."}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {/* ── Pagination ───────────────────────────────────── */}
          {pages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <button
                type="button"
                disabled={page <= 1 || busy}
                onClick={() => {
                  setLoading(true);
                  setPage((p) => Math.max(1, p - 1));
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 transition shadow-sm"
              >
                ← Trang trước
              </button>

              <span className="text-xs sm:text-sm font-medium text-slate-500">
                Trang <strong className="text-slate-900">{page}</strong> /{" "}
                <strong>{pages}</strong> ({total} đơn)
              </span>

              <button
                type="button"
                disabled={page >= pages || busy}
                onClick={() => {
                  setLoading(true);
                  setPage((p) => Math.min(pages, p + 1));
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 transition shadow-sm"
              >
                Trang sau →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
