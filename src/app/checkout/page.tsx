"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import { formatVND } from "@/lib/priceUtils";
import { storeDirectory } from "@/lib/stores";
import type { CartItem } from "@/context/AppContext";
type Quote = {
  items: CartItem[];
  total: number;
  deliveryFee: number;
  mode: string;
  sellerName: string;
  branch: string;
  serviceArea: string;
};
type Settings = {
  mode: string;
  payments: Record<string, boolean>;
  momoEnvironment: string;
  stores: { key: string; acceptingOrders: boolean }[];
};
export default function CheckoutPage() {
  return <Suspense fallback={<p role="status">Đang tải các món đã chọn…</p>}><CheckoutForm /></Suspense>;
}
function CheckoutForm() {
  const { state, removePurchased } = useAppContext(),
    router = useRouter();
  const search = useSearchParams();
  const items = useMemo(() => {
    const selected = search.getAll('recipe');
    return search.has('recipe') ? state.cart.filter(item => selected.includes(item.recipeId)) : state.cart;
  }, [search, state.cart]);
  const [store, setStore] = useState<string>(state.selectedStore ?? "Winmart");
  const [address, setAddress] = useState(state.user?.address ?? ""),
    [phone, setPhone] = useState(state.user?.phone ?? "");
  const [payment, setPayment] = useState("cod"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const [quoteResult, setQuoteResult] = useState<{
      key: string;
      quote: Quote | null;
      error: string;
    } | null>(null),
    [settings, setSettings] = useState<Settings | null>(null),
    [version, setVersion] = useState(0);
  const quoteKey = JSON.stringify({ items, store, version });
  const quote = quoteResult?.key === quoteKey ? quoteResult.quote : null;
  const quoteError = quoteResult?.key === quoteKey ? quoteResult.error : "";
  const request = useRef<{ payload: string; id: string } | null>(null);
  useEffect(() => {
    fetch("/api/stores")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.message);
        setSettings(d);
      })
      .catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    if (items.length)
      fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, store }),
        signal: controller.signal,
      })
        .then(async (r) => {
          const d = await r.json();
          if (!r.ok) throw Error(d.message);
          if (!controller.signal.aborted)
            setQuoteResult({ key: quoteKey, quote: d.quote, error: "" });
        })
        .catch((e) => {
          if (!controller.signal.aborted)
            setQuoteResult({ key: quoteKey, quote: null, error: e.message });
        });
    return () => controller.abort();
  }, [items, store, version, quoteKey]);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || !quote) return;
    setBusy(true);
    setError("");
    try {
      const payload = JSON.stringify({
        items,
        store,
        address,
        phone,
        paymentMethod: payment,
        expectedTotal: quote.total,
      });
      if (request.current?.payload !== payload)
        request.current = { payload, id: crypto.randomUUID() };
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...JSON.parse(payload),
          clientRequestId: request.current.id,
        }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.message);
      // Save the order first; provider failure must never cause a second order.
      removePurchased(items);
      if (payment === "bank") {
        router.push("/payment/" + encodeURIComponent(d.order.orderId));
        return;
      }
      if (payment === "momo") {
        try {
          const response = await fetch("/api/payments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: d.order.orderId, action: "create" }),
          });
          const result = await response.json();
          if (!response.ok || !result.checkoutUrl) throw Error("Payment unavailable");
          window.location.assign(result.checkoutUrl);
          return;
        } catch {
          router.push("/orders?payment=unavailable");
          return;
        }
      }
      router.push("/orders");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không thể tạo đơn.");
      setBusy(false);
    }
  }
  if (!items.length && !busy)
    return (
      <div className="card-outlined p-12 text-center">
        <h1>Chưa có món nào được chọn để đặt hàng</h1>
        <Link href="/grocery-store" className="btn-filled mt-5">
          Quay lại chọn món
        </Link>
      </div>
    );
  return (
    <form onSubmit={submit} className="max-w-3xl mx-auto space-y-6">
      <Link href="/grocery-store" className="text-primary">
        ← Quay lại giỏ hàng
      </Link>
      <h1 className="text-3xl font-extrabold">Xác nhận đơn hàng</h1>
      <p className="p-4 bg-secondary-container/40 rounded-xl text-sm">
        {settings?.mode === "live"
          ? "Kiểm tra người bán và khu vực giao hàng trước khi đặt. Khi chọn thanh toán trực tuyến, bạn sẽ được chuyển đến cổng thanh toán sau khi tạo đơn."
          : "Đơn thử nghiệm không thu tiền và không gửi đến cửa hàng."}{" "}
        <Link href="/stores" className="underline">
          Xem cửa hàng và nguồn dữ liệu
        </Link>
      </p>
      <section className="card-outlined p-6 space-y-4">
        <h2 className="font-bold">Chọn cửa hàng</h2>
        {storeDirectory.map((s) => (
          <label key={s.key} className="flex gap-3 border rounded-xl p-4">
            <input
              type="radio"
              name="store"
              checked={store === s.key}
              disabled={busy}
              onChange={() => setStore(s.key)}
            />
            <span>
              {s.name}
              {settings?.mode === "live" &&
              !settings.stores.find((x) => x.key === s.key)?.acceptingOrders
                ? " · Chưa nhận đơn qua ứng dụng"
                : ""}
            </span>
          </label>
        ))}
      </section>
      {quote && (
        <section className="card-outlined p-6 space-y-4">
          <h2 className="font-bold">Nguyên liệu của các món đã chọn</h2>
          <p className="text-sm text-on-surface-variant">{[...new Set(items.map(i => i.recipeTitle))].join(" · ")}</p>
          {quote.sellerName && (
            <p>
              Người bán: {quote.sellerName} · {quote.branch}
              <br />
              Giao tại: {quote.serviceArea}
            </p>
          )}
          {quote.items.map((i) => (
            <div
              key={i.ingredient.id}
              className="flex justify-between gap-3 text-sm"
            >
              <span>
                {i.ingredient.name} · {i.quantity} {i.ingredient.unit}
              </span>
              <strong>{formatVND(i.ingredient.price * i.quantity)}</strong>
            </div>
          ))}
          <p>Phí giao: {formatVND(quote.deliveryFee)}</p>
          <p className="font-bold text-primary">
            Tổng thanh toán: {formatVND(quote.total)}
          </p>
        </section>
      )}
      <section className="card-outlined p-6 space-y-4">
        <label className="block">
          Số điện thoại
          <input
            required
            type="tel"
            minLength={9}
            maxLength={20}
            value={phone}
            disabled={busy}
            onChange={(e) => setPhone(e.target.value)}
            className="block w-full border rounded-xl p-3 mt-2"
          />
        </label>
        <label className="block">
          Địa chỉ giao hàng
          <textarea
            required
            minLength={10}
            maxLength={300}
            disabled={busy}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="block w-full border rounded-xl p-3 mt-2"
          />
        </label>
        <label className="block">
          Phương thức thanh toán
          <select
            value={payment}
            disabled={busy}
            onChange={(e) => setPayment(e.target.value)}
            className="block w-full border rounded-xl p-3 mt-2"
          >
            <option value="cod">Thanh toán khi nhận hàng</option>
            <option
              value="bank"
              disabled={settings?.mode !== "live" || !settings?.payments.bank}
            >
              QR ngân hàng · payOS
              {!settings?.payments.bank ? " (chưa sẵn sàng)" : settings.mode !== "live" ? " (chưa bật thanh toán thật)" : ""}
            </option>
            <option
              value="momo"
              disabled={!settings?.payments.momo || (settings?.mode !== "live" && settings?.momoEnvironment !== "sandbox")}
            >
              MoMo
              {settings?.momoEnvironment === "sandbox" ? " · thử nghiệm" : ""}
              {!settings?.payments.momo ? " (chưa cấu hình)" : ""}
            </option>
          </select>
        </label>
        {settings && (settings.mode !== "live" || !settings.payments.bank) && (
          <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 space-y-2">
            <p>QR ngân hàng chưa sẵn sàng. Website chỉ tạo mã QR sau khi cổng payOS được cấu hình và bật thanh toán trực tuyến.</p>
            {state.user?.isAdmin && <p>Quản trị viên: kiểm tra PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, APP_URL, LIVE_PAYMENTS_ENABLED=true và COMMERCE_MODE=live trong môi trường đang chạy. Trên Vercel cần Redeploy sau khi lưu. Cửa hàng phải bật nhận đơn và có giá, tồn kho hợp lệ.</p>}
          </div>
        )}
        {payment === "momo" && <p className="rounded-xl bg-pink-50 p-4 text-sm text-pink-900">{settings?.momoEnvironment === "sandbox" ? "MoMo thử nghiệm: dùng ứng dụng/tài khoản test theo hướng dẫn MoMo, không dùng tiền thật." : "Bạn sẽ xác nhận thanh toán trên trang MoMo. Đơn chỉ được đánh dấu đã thanh toán sau khi backend xác minh giao dịch."}</p>}
      </section>
      {(error || quoteError) && (
        <p role="alert" className="text-error">
          {error || quoteError}
        </p>
      )}
      <button
        type="button"
        disabled={busy}
        className="btn-outlined"
        onClick={() => setVersion((v) => v + 1)}
      >
        Tải lại báo giá
      </button>
      <button
        disabled={busy || !quote || !settings}
        className="btn-filled w-full"
      >
        {busy
          ? "Đang xử lý đơn và thanh toán…"
          : "Đặt đơn hàng" +
            (quote ? " · " + formatVND(quote.total) : "")}
      </button>
    </form>
  );
}
