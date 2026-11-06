"use client";
import UserPageHeader from "@/components/ui/UserPageHeader";

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
  const [paymentNotice, setPaymentNotice] = useState("");
  const [receiveId, setReceiveId] = useState("");
  const [syncError, setSyncError] = useState("");
  useEffect(() => {
    if (busy || loading) return;
    const controller = new AbortController();
    let fetching = false;
    async function refresh() {
      if (document.visibilityState !== "visible" || fetching) return;
      fetching = true;
      try {
        const response = await fetch("/api/orders", { cache: "no-store", signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw Error(data.message || "Chưa cập nhật được trạng thái đơn hàng.");
        if (!controller.signal.aborted) { setOrders(normalizeOrders(data.orders)); setSyncError(""); }
      } catch (e) {
        if (!controller.signal.aborted) setSyncError(e instanceof Error ? e.message : "Chưa cập nhật được trạng thái đơn hàng.");
      } finally { fetching = false; }
    }
    const timer = setInterval(() => void refresh(), 15000);
    document.addEventListener("visibilitychange", refresh);
    return () => { controller.abort(); clearInterval(timer); document.removeEventListener("visibilitychange", refresh); };
  }, [busy, loading]);
  useEffect(() => {
    let active = true;
    async function reconcileReturn() {
      const params = new URLSearchParams(window.location.search);
      if (params.get("payment") === "unavailable") {
        if (active) setPaymentNotice("Đơn đã được lưu nhưng chưa mở được cổng thanh toán. Dùng nút kiểm tra trạng thái hoặc thanh toán trong đơn bên dưới; không cần tạo lại đơn.");
      }
      const orderId = params.get("paymentOrder");
      if (!orderId || orderId.length > 100) return;
      if (active) setPaymentNotice("Đang xác minh giao dịch với cổng thanh toán…");
      try {
        const response = await fetch("/api/payments", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, action: "check" }),
        });
        const data = await response.json();
        if (!response.ok) throw Error(data.message || "Chưa xác minh được thanh toán.");
        if (active) setPaymentNotice(data.paid ? "Cổng thanh toán đã xác nhận giao dịch thành công." : "Chưa nhận được xác nhận thanh toán. Nếu đã trả tiền, hãy dùng nút kiểm tra trạng thái trong đơn; không thanh toán lại ngay.");
      } catch (e) {
        if (active) setPaymentNotice(e instanceof Error ? e.message : "Chưa xác minh được thanh toán.");
      }
    }
    reconcileReturn().then(() => fetch("/api/orders"))
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
      setReceiveId("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Có lỗi xảy ra.");
    } finally {
      setBusy("");
    }
  }
  async function pay(order: GroceryOrder, action = "create") {
    if (order.paymentMethod === "bank" && action === "create") { router.push("/payment/" + encodeURIComponent(order.orderId)); return; }
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
      <UserPageHeader eyebrow="MUA SẮM CỦA BẠN" title="Đơn hàng của bạn" description="Theo dõi trạng thái, kiểm tra thanh toán và mua lại nguyên liệu cho món yêu thích." action={<Link href="/meal-plan" className="btn-outlined">Tiếp tục chọn món →</Link>}/>
      {paymentNotice && <p role="status" className="rounded-xl border border-outline-variant bg-surface p-4 text-sm">{paymentNotice}</p>}
      <p className="rounded-xl bg-secondary-container/40 p-4 text-sm">
        Theo dõi trạng thái thanh toán trên từng đơn hàng.
      </p>
      <div data-user-toolbar className="flex gap-2 overflow-x-auto pb-2">
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
      {syncError && <p role="status" className="text-amber-800">{syncError} Hệ thống sẽ tự kiểm tra lại.</p>}
      <p className="text-xs text-on-surface-variant">Trạng thái tự cập nhật mỗi 15 giây khi bạn mở trang. Chỉ xác nhận nhận hàng sau khi đã nhận đủ hàng.</p>
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
                <p className="text-sm">{o.mode === "live" ? (o.paymentStatus === "paid" ? "Đã mua · Đã thanh toán" : o.paymentStatus === "review" ? "Cần đối soát thanh toán" : "Chưa xác nhận thanh toán") : "Không thu tiền"}</p>
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
              {o.status === "unpaid" && ["bank", "momo"].includes(o.paymentMethod) && (o.mode === "live" || (o.paymentMethod === "momo" && o.paymentEnvironment === "sandbox")) && (
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
              {["delivering", "delivered"].includes(o.status) && (o.paymentStatus === "paid" || (o.paymentMethod === "cod" && o.paymentStatus === "cod")) && (
                <button
                  disabled={!!busy}
                  className="btn-outlined"
                  onClick={() => setReceiveId(o.orderId)}
                >
                  Xác nhận đã nhận hàng
                </button>
              )}
            </div>
            {o.status === "confirmed" && <p className="text-sm text-on-surface-variant">Cửa hàng đang chuẩn bị đơn. Trạng thái sẽ đổi khi người giao nhận hàng.</p>}
            {o.status === "delivered" && <p className="text-sm text-on-surface-variant">Cửa hàng đã đánh dấu giao hàng. Bạn hãy kiểm tra hàng và xác nhận đã nhận.</p>}
            {o.fulfillment?.receivedAt && <p className="text-sm text-primary">Đã xác nhận nhận hàng lúc {orderDate(o.fulfillment.receivedAt)}.</p>}
            {receiveId === o.orderId && ["delivering", "delivered"].includes(o.status) && <div className="rounded-xl border border-primary/30 bg-primary-container/20 p-4 space-y-3">
              <p className="font-semibold">Bạn đã nhận đủ hàng của đơn này?</p>
              <p className="text-sm">Xác nhận sẽ hoàn tất đơn hàng. Nếu chưa nhận được hàng, hãy chọn “Chưa nhận”.</p>
              <div className="flex flex-wrap gap-3"><button disabled={!!busy} className="btn-filled" onClick={() => void update(o, "receive")}>{busy ? "Đang lưu…" : "Đã nhận đủ hàng"}</button><button disabled={!!busy} className="btn-outlined" onClick={() => setReceiveId("")}>Chưa nhận</button></div>
            </div>}
          </article>
        ))
      )}
    </div>
  );
}
