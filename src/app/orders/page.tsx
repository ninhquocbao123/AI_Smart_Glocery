"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Package, RotateCcw } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { orderLabels, type GroceryOrder, type OrderStatus, normalizeOrders, orderMoney, orderItemMoney, orderDate, reorderItems } from "@/lib/orders";
export default function OrdersPage() {
  const [orders, setOrders] = useState<GroceryOrder[]>([]),
    [filter, setFilter] = useState<OrderStatus | "all">("all"),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState("");
  const { addMultipleToCart } = useAppContext();
  const router = useRouter();
  useEffect(() => {
    let active = true;
    fetch("/api/orders")
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
        prev.map((o) => (o.orderId === order.orderId ? (normalizeOrders([d.order])[0] ?? o) : o)),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
    } finally {
      setBusy("");
    }
  }
  async function pay(order: GroceryOrder, action = "create") {
    setBusy(order.orderId); setError("");
    try {
      const r = await fetch("/api/payments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ orderId: order.orderId, action }) });
      const d = await r.json(); if (!r.ok) throw Error(d.message);
      if (d.checkoutUrl) { window.location.assign(d.checkoutUrl); return; }
      if (d.order) setOrders(prev => prev.map(o => o.orderId === order.orderId ? normalizeOrders([d.order])[0] ?? o : o));
      if (!d.paid) setError("Cổng thanh toán chưa xác nhận nhận tiền. Bạn có thể kiểm tra lại sau.");
    } catch (e) { setError(e instanceof Error ? e.message : "Không thể mở thanh toán."); }
    finally { setBusy(""); }
  }
  const list = orders.filter((o) => filter === "all" || o.status === filter);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-primary text-sm font-bold">ORDERS</p>
        <h1 className="text-3xl font-extrabold mt-2">Đơn hàng của bạn</h1>
        <p className="text-on-surface-variant mt-2">
          Theo dõi nguyên liệu từ lúc đặt đến bữa cơm nhà.
        </p>
      </div>
      <p className="rounded-xl bg-secondary-container/40 p-4 text-sm">
        Đơn có nhãn Demo không thu tiền. Với đơn trực tuyến, trạng thái thanh toán được xác nhận từ cổng thanh toán. Việc quay lại trang này chưa có nghĩa là đã trả tiền.
      </p>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {(
          [["all", "Tất cả"], ...Object.entries(orderLabels)] as [
            OrderStatus | "all",
            string,
          ][]
        ).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={
              "px-4 py-2 rounded-full whitespace-nowrap " +
              (filter === id ? "bg-primary text-white" : "bg-surface-container")
            }
          >
            {label} (
            {orders.filter((o) => id === "all" || o.status === id).length})
          </button>
        ))}
      </div>
      {error && (
        <p role="alert" className="text-error">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Đang tải đơn hàng…</p>
      ) : !list.length ? (
        <div className="card-outlined p-12 text-center">
          <Package className="mx-auto mb-4" />
          <h2 className="font-bold">Chưa có đơn hàng ở trạng thái này</h2>
          <Link
            className="inline-block mt-4 text-primary underline"
            href="/meal-plan"
          >
            Khám phá món Việt
          </Link>
        </div>
      ) : (
        list.map((o) => (
          <article key={o.orderId} className="card-outlined p-5 space-y-4">
            <div className="flex justify-between gap-4 flex-wrap">
              <div>
                <h2 className="font-bold">{o.orderId}</h2>
                {o.paymentEnvironment === "sandbox" && <p className="text-sm font-semibold">MoMo thử nghiệm · Không phải tiền thật</p>}
                <p className="text-sm">{o.mode === "live" ? (o.paymentStatus === "paid" ? "Đã thanh toán" : o.paymentStatus === "review" ? "Cần đối soát thanh toán" : "Chưa xác nhận thanh toán") : "Demo · Không thu tiền"}</p>
                <p className="text-sm text-on-surface-variant">
                  {orderDate(o.createdAt)}{" "}
                  · {o.store}
                </p>
              </div>
              <div className="text-right">
                <span className="text-sm bg-primary-container px-3 py-1 rounded-full">
                  {orderLabels[o.status]}
                </span>
                <p className="text-xl text-primary font-bold mt-2">
                  {orderMoney(o.total)}
                </p>
              </div>
            </div>
            <details>
              <summary className="cursor-pointer font-semibold">
                Chi tiết · {o.items.length} nguyên liệu
              </summary>
              <ul className="divide-y divide-outline-variant mt-3">
                {o.items.map((i, n) => (
                  <li
                    key={n}
                    className="py-2 flex justify-between gap-3 text-sm"
                  >
                    <span>
                      {i.ingredient.name} · {i.quantity ?? "Chưa rõ số lượng"} {i.ingredient.unit}
                    </span>
                    <span>{orderItemMoney(i)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm mt-2">
                Phí giao hàng: {orderMoney(o.deliveryFee)}
                <br />
                Giao đến: {o.address}
                <br />
                Phương thức:{" "}
                {o.paymentMethod === "cod"
                  ? "Trả khi nhận hàng"
                  : o.paymentMethod.toUpperCase()}
              </p>
            </details>
            {!reorderItems(o) && <p className="text-sm text-on-surface-variant">Đơn cũ thiếu mã nguyên liệu hợp lệ để mua lại. Bạn vẫn xem được lịch sử; hãy chọn nguyên liệu mới tại <Link href="/meal-plan" className="text-primary underline">Smart Cart</Link>.</p>}
            <div className="flex flex-wrap gap-3">
              {o.mode === "demo" && o.status === "unpaid" && o.paymentEnvironment !== "sandbox" && <button disabled={!!busy} className="btn-filled" onClick={()=>update(o,"demoPay")}>Mô phỏng thanh toán thành công</button>}
              {o.mode === "demo" && o.status === "confirmed" && <button disabled={!!busy} className="btn-outlined" onClick={()=>update(o,"demoShip")}>Demo: bắt đầu giao hàng</button>}
              {o.mode === "demo" && o.status === "delivering" && <button disabled={!!busy} className="btn-outlined" onClick={()=>update(o,"demoReceive")}>Demo: hoàn thành đơn</button>}
              {["unpaid", "confirmed"].includes(o.status) && !o.paymentStarted && o.paymentStatus !== "paid" && <button disabled={!!busy} className="text-error" onClick={()=>update(o,"cancel")}>Hủy đơn chưa xử lý</button>}
              <button
                className="btn-filled"
                disabled={!reorderItems(o)}
                title={!reorderItems(o) ? "Đơn cũ thiếu thông tin hoặc nguyên liệu không còn trong danh mục. Hãy chọn lại món." : undefined}
                onClick={() => {
                  const refreshed = reorderItems(o);
                  if (!refreshed) return;
                  addMultipleToCart(refreshed);
                  router.push("/grocery-store");
                }}
              >
                <RotateCcw size={16} /> Mua lại
              </button>
              {o.status === "unpaid" && (o.mode === "live" || (o.paymentMethod === "momo" && o.paymentEnvironment === "sandbox")) && (
                <>
                  <button
                    disabled={!!busy}
                    className="btn-outlined"
                    onClick={() => pay(o)}
                  >
                    Thanh toán {o.paymentMethod === "momo" ? "MoMo" : "QR ngân hàng"}
                  </button>
                  <button disabled={!!busy} className="btn-outlined" onClick={() => pay(o, "check")}>Kiểm tra thanh toán</button>
                </>
              )}
              {["delivering", "delivered"].includes(o.status) && (
                <button
                  disabled={!!busy}
                  className="btn-outlined"
                  onClick={() => update(o, "receive")}
                >
                  Xác nhận đã nhận hàng
                </button>
              )}
            </div>
          </article>
        ))
      )}
    </div>
  );
}
