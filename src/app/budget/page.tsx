"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Calendar,
  Store,
  ChevronDown,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Receipt,
  CheckCircle2,
} from "lucide-react";
import UserPageHeader from "@/components/ui/UserPageHeader";
import {
  type GroceryOrder,
  monthKey,
  normalizeOrders,
  orderMoney,
  orderItemMoney,
  orderDate,
} from "@/lib/orders";
import { formatVND } from "@/lib/priceUtils";

export default function BudgetPage() {
  const [target, setTarget] = useState(0);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState<GroceryOrder[]>([]);
  const [month, setMonth] = useState(() => monthKey(new Date()));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/budget")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.message);
        setOrders(normalizeOrders(d.orders));
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setTarget(0);
    setDraft("");
    fetch("/api/budget/target?month=" + month, { signal: controller.signal })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.message);
        setTarget(d.amount);
        setDraft(String(d.amount));
      })
      .catch((e) => {
        if (!controller.signal.aborted) setError(e.message);
      });
    return () => controller.abort();
  }, [month]);

  const list = orders.filter((o) => monthKey(o.createdAt) === month);
  const spent = list.reduce((s, o) => s + (o.total ?? 0), 0);
  const remaining = target - spent;
  const percentUsed = Math.round(target > 0 ? (spent / target) * 100 : 0);

  const stores = list.reduce<Record<string, number>>((s, o) => {
    s[o.store] = (s[o.store] || 0) + (o.total ?? 0);
    return s;
  }, {});

  const handleSaveBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const r = await fetch("/api/budget/target", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ month, amount: Number(draft) }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.message);
      setTarget(d.amount);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể lưu ngân sách.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <UserPageHeader
        eyebrow="QUẢN LÝ TÀI CHÍNH"
        title="Ngân sách & Chi tiêu hàng tháng"
        description="Theo dõi sát sao từng khoản chi đi chợ, phân loại theo siêu thị và không lo vung tay quá trán."
        action={
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1.5 shadow-sm">
            <Calendar size={16} className="text-slate-500 ml-2" />
            <input
              aria-label="Tháng theo dõi"
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-800 outline-none px-2 py-1 cursor-pointer"
            />
          </div>
        }
      />

      {/* Target Budget Form */}
      <form
        onSubmit={handleSaveBudget}
        className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-wrap items-end gap-4"
      >
        <div className="flex-1 min-w-[240px]">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Hạn mức ngân sách cho tháng {month}
          </label>
          <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
            <Wallet size={18} className="text-emerald-700 shrink-0" />
            <input
              required
              type="number"
              min="0"
              max="1000000000"
              step="10000"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Nhập số tiền dự kiến (ví dụ: 2.000.000đ)…"
              className="w-full bg-transparent text-sm font-bold text-slate-800 outline-none placeholder:font-normal"
            />
            <span className="text-xs font-bold text-slate-400">VNĐ</span>
          </div>
        </div>

        <button
          disabled={saving}
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-all disabled:opacity-40 cursor-pointer"
        >
          {saving ? "Đang lưu…" : "Cập nhật ngân sách"}
        </button>
      </form>

      {/* 3 Metric Cards */}
      <div className="grid sm:grid-cols-3 gap-5">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Ngân sách tháng
          </span>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {formatVND(target)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            Hạn mức bạn đã thiết lập
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Đã chi tiêu
          </span>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">
            {formatVND(spent)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {list.length} đơn hàng hoàn tất
          </span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Còn lại
          </span>
          <p
            className={`text-2xl sm:text-3xl font-black mt-2 ${
              remaining < 0 ? "text-red-600" : "text-emerald-700"
            }`}
          >
            {formatVND(remaining)}
          </p>
          <span className="text-xs text-slate-500 mt-1 block">
            {remaining < 0 ? "Đã vượt hạn mức đặt ra!" : "Vẫn trong tầm kiểm soát"}
          </span>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-sm font-bold">
          <span className="text-slate-800">Tiến độ chi tiêu tháng</span>
          <span
            className={
              percentUsed > 100 ? "text-red-600" : "text-emerald-700"
            }
          >
            Đã dùng {percentUsed}% ngân sách
          </span>
        </div>

        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              percentUsed > 100
                ? "bg-red-600"
                : percentUsed > 80
                ? "bg-amber-500"
                : "bg-emerald-600"
            }`}
            style={{ width: `${Math.min(100, percentUsed)}%` }}
          />
        </div>

        <p className="text-xs text-slate-500 leading-relaxed">
          * Số liệu bao gồm tiền nguyên liệu và phí vận chuyển thực tế của các đơn đã
          thanh toán trong tháng {month}.
        </p>
      </div>

      {error && (
        <p role="alert" className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
          {error}
        </p>
      )}

      {/* Split: Order History & Store Breakdown */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Left: Orders list (8 cols) */}
        <section className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Receipt size={18} className="text-emerald-700" />
              <span>Lịch sử mua sắm trong tháng ({list.length} đơn)</span>
            </h2>
          </div>

          {loading ? (
            <p className="py-8 text-center text-slate-500 text-sm">
              Đang tải danh sách đơn…
            </p>
          ) : !list.length ? (
            <div className="py-12 text-center text-slate-400">
              <Receipt size={36} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold">
                Chưa có đơn hàng nào được ghi nhận trong tháng này.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {list.map((o) => (
                <details
                  key={o.orderId}
                  className="py-4 group transition-colors"
                >
                  <summary className="cursor-pointer list-none flex items-center justify-between gap-3 text-sm font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <Store size={16} className="text-emerald-700" />
                      <span>{o.store}</span>
                      <span className="text-slate-400 font-normal">·</span>
                      <span className="text-xs font-semibold text-slate-500">
                        {orderDate(o.createdAt, true)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-700 font-black">
                        {orderMoney(o.total)}
                      </span>
                      <ChevronDown
                        size={15}
                        className="text-slate-400 group-open:rotate-180 transition-transform"
                      />
                    </div>
                  </summary>

                  <div className="mt-3 pl-6 pt-2 text-xs text-slate-600 space-y-1.5 border-l-2 border-emerald-500/30">
                    <p className="font-mono text-[11px] text-slate-400">
                      Mã đơn: {o.orderId}
                    </p>
                    {o.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between py-0.5 text-slate-700"
                      >
                        <span>
                          {item.ingredient.name} × {item.quantity ?? 1}{" "}
                          {item.ingredient.unit}
                        </span>
                        <span className="font-semibold">
                          {orderItemMoney(item)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 flex justify-between font-semibold text-slate-800">
                      <span>Phí giao hàng:</span>
                      <span>{orderMoney(o.deliveryFee)}</span>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          )}
        </section>

        {/* Right: Store Breakdown (4 cols) */}
        <aside className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Store size={18} className="text-emerald-700" />
            <span>Chi tiêu theo siêu thị</span>
          </h2>

          <div className="space-y-4">
            {Object.entries(stores).map(([storeName, storeTotal]) => {
              const storePercent = spent > 0 ? (storeTotal / spent) * 100 : 0;
              return (
                <div key={storeName} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-800">{storeName}</span>
                    <span className="text-emerald-800">
                      {formatVND(storeTotal)}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${storePercent}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 font-semibold block text-right">
                    {Math.round(storePercent)}% tổng chi
                  </span>
                </div>
              );
            })}

            {!list.length && (
              <p className="text-xs text-slate-400 text-center py-4">
                Dữ liệu sẽ xuất hiện khi bạn thanh toán đơn đầu tiên.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <Link
              href="/orders"
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-emerald-800 transition-all"
            >
              <span>Xem chi tiết tất cả đơn hàng</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
