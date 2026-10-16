"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Wallet } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { type GroceryOrder, monthKey, normalizeOrders, orderMoney, orderItemMoney, orderDate } from "@/lib/orders";
import { formatVND } from "@/lib/priceUtils";
export default function BudgetPage() {
  const { state } = useAppContext();
  const [orders, setOrders] = useState<GroceryOrder[]>([]),
    [month, setMonth] = useState(() => monthKey(new Date())),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
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
  const list = orders.filter((o) => monthKey(o.createdAt) === month),
    spent = list.reduce((s, o) => s + (o.total ?? 0), 0),
    target = state.user?.monthlyBudgetTarget ?? 1500000;
  const stores = list.reduce<Record<string, number>>((s, o) => {
    s[o.store] = (s[o.store] || 0) + (o.total ?? 0);
    return s;
  }, {});
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-4 flex-wrap">
        <div>
          <p className="text-primary text-sm font-bold">MY BUDGET</p>
          <h1 className="text-3xl font-extrabold mt-2">
            Chi tiêu trong tầm tay
          </h1>
          <p className="text-on-surface-variant mt-2">
            Biết mình đã mua gì, ở đâu và còn bao nhiêu ngân sách.
          </p>
        </div>
        <label className="text-sm">
          Tháng theo dõi
          <input
            aria-label="Tháng theo dõi"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="block border rounded-xl p-3 bg-surface mt-2"
          />
        </label>
      </div>
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ["Ngân sách tháng", target],
          ["Đã chi", spent],
          ["Còn lại", target - spent],
        ].map(([label, value]) => (
          <div key={label} className="card-outlined p-6">
            <Wallet className="text-primary mb-3" />
            <p className="text-sm text-on-surface-variant">{label}</p>
            <p
              className={
                "text-2xl font-extrabold mt-2 " +
                (Number(value) < 0 ? "text-error" : "text-primary")
              }
            >
              {formatVND(Number(value))}
            </p>
          </div>
        ))}
      </div>
      <div className="h-3 rounded-full bg-surface-container overflow-hidden">
        <div
          className="h-full bg-primary"
          style={{ width: Math.min(100, (spent / target) * 100) + "%" }}
        />
      </div>
      <p className="text-sm text-on-surface-variant">
        Số liệu theo tháng đặt hàng, đã gồm phí giao, chỉ tính đơn đã thu tiền.{" "}
        <Link className="text-primary underline" href="/profile">
          Đổi ngân sách mục tiêu
        </Link>
      </p>
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      {orders.some(o => !o.createdAt || o.total === null) && <p role="status" className="text-sm text-on-surface-variant">Một số đơn cũ thiếu ngày đặt hoặc tổng tiền nên chưa thể tính đầy đủ vào chi tiêu tháng. Xem chi tiết tại Orders.</p>}
      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        <section className="card-outlined p-6">
          <h2 className="text-lg font-bold mb-4">
            Lịch sử mua sắm · {list.length} đơn
          </h2>
          {loading ? (
            <p role="status">Đang tải chi tiêu…</p>
          ) : !list.length ? (
            <p className="py-8 text-on-surface-variant">
              Chưa có chi tiêu được ghi nhận trong tháng này.
            </p>
          ) : (
            list.map((o) => (
              <details
                key={o.orderId}
                className="py-4 border-b border-outline-variant"
              >
                <summary className="cursor-pointer">
                  <span className="font-bold">{o.store}</span> ·{" "}
                  {orderDate(o.createdAt, true)}
                  <span className="float-right font-bold text-primary">
                    {orderMoney(o.total)}
                  </span>
                </summary>
                <p className="text-sm my-2">{o.orderId}</p>
                {o.items.map((i, n) => (
                  <p key={n} className="text-sm py-1">
                    {i.ingredient.name} — {i.quantity ?? "Chưa rõ số lượng"} {i.ingredient.unit} ·{" "}
                    {orderItemMoney(i)}
                  </p>
                ))}
                <p className="text-sm mt-2">
                  Giao hàng: {orderMoney(o.deliveryFee)}
                </p>
              </details>
            ))
          )}
        </section>
        <aside className="card-outlined p-6 h-fit">
          <h2 className="font-bold mb-4">Chi tiêu theo cửa hàng</h2>
          {Object.entries(stores).map(([store, total]) => (
            <div key={store} className="py-3">
              <p className="flex justify-between text-sm gap-3">
                <span>{store}</span>
                <strong>{formatVND(total)}</strong>
              </p>
              <div className="h-2 bg-primary-container rounded-full mt-2">
                <div
                  className="h-2 bg-primary rounded-full"
                  style={{ width: (spent > 0 ? total / spent : 0) * 100 + "%" }}
                />
              </div>
            </div>
          ))}
          {!list.length && (
            <p className="text-sm text-on-surface-variant">
              Dữ liệu sẽ xuất hiện khi bạn hoàn thành đơn đầu tiên.
            </p>
          )}
          <Link
            href="/orders"
            className="text-primary underline inline-block mt-4"
          >
            Quản lý đơn hàng →
          </Link>
        </aside>
      </div>
    </div>
  );
}
