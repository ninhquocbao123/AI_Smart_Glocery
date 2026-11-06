"use client";
import UserPageHeader from "@/components/ui/UserPageHeader";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PLANS } from "@/lib/membership";
type Info = {
  checkout?: {available: boolean; methods: {bank: boolean; momo: boolean}};
  plan: keyof typeof PLANS;
  endsAt?: string;
  chatRemaining: number;
  mealRemaining: number;
  chatReset: number;
  mealReset: number;
  history: {
    _id: string;
    plan: keyof typeof PLANS;
    startsAt: string;
    endsAt: string;
    source: string;
    revokedAt?: string;
  }[];
  purchases: { orderId: string; total: number; paymentStatus: string }[];
};
export default function MembershipPage() {
  const router = useRouter();
  const [info, setInfo] = useState<Info | null>(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [method, setMethod] = useState("bank");
  useEffect(() => {
    fetch("/api/membership")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.message);
        setInfo(d);
        setMethod(d.checkout?.methods.bank ? "bank" : d.checkout?.methods.momo ? "momo" : "");
      })
      .catch((e) => setError(e.message));
  }, []);
  async function buy(plan: string) {
    if (!info?.checkout?.available || !info.checkout.methods[method as "bank" | "momo"]) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/membership", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, method }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.message);
      router.push("/payment/" + encodeURIComponent(d.orderId));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <UserPageHeader eyebrow="THÊM TIỆN ÍCH CHO CĂN BẾP" title="Một gói phù hợp với bạn" description="Bắt đầu miễn phí. Chọn VIP khi cần lên thực đơn nhanh hơn, hoặc VIP Plus để quản lý cả nguyên liệu và chi tiêu."/>
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      {info && (
        <div className="bg-white border rounded-2xl p-5">
          <b>Gói hiện tại: {PLANS[info.plan].name}</b>
          <p>
            {info.endsAt
              ? "Hết hạn: " + new Date(info.endsAt).toLocaleString("vi-VN")
              : "Không giới hạn thời hạn"}
          </p>
          <p>
            Còn {info.chatRemaining} lượt chat hôm nay · {info.mealRemaining}{" "}
            lượt tạo thực đơn trong chu kỳ.
          </p>
          <p className="text-sm text-gray-500">
            Cấp lại lượt thực đơn:{" "}
            {new Date(info.mealReset).toLocaleString("vi-VN")}
          </p>
        </div>
      )}
      {info && !info.checkout?.available && <p role="status" className="border rounded-xl p-4 text-sm">Đăng ký trả phí hiện chưa mở. Bạn vẫn có thể dùng gói miễn phí; vui lòng quay lại khi cổng thanh toán hoạt động.</p>}
      <label className="block">
        Thanh toán bằng{" "}
        <select
          className="border rounded-xl p-3"
          disabled={!info?.checkout?.available}
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          {!info?.checkout?.available && <option value="">Chưa có phương thức khả dụng</option>}
          {info?.checkout?.methods.bank && <option value="bank">Chuyển khoản / QR PayOS</option>}
          {info?.checkout?.methods.momo && <option value="momo">MoMo</option>}
        </select>
      </label>
      <div className="grid md:grid-cols-3 gap-5">
        {Object.entries(PLANS).map(([key, p]) => (
          <div
            key={key}
            data-plan-card={key}
            className={`rounded-3xl border p-7 space-y-5 ${key === "plus" ? "bg-emerald-950 text-white" : "bg-white"}`}
          >
            <h2 className="text-2xl font-bold">{p.name}</h2>
            <p className="text-3xl font-bold">
              {p.price.toLocaleString("vi-VN")}đ{" "}
              <span className="text-sm font-normal">
                {p.price ? "/ 30 ngày" : ""}
              </span>
            </p>
            <ul className="space-y-3">
              <li>✓ {p.chat} lượt chat AI/ngày</li>
              <li>
                ✓ {p.generations} lần tạo thực đơn/
                {key === "free" ? "tuần" : "30 ngày"}
              </li>
              <li>✓ Tối đa {p.days} ngày/thực đơn</li>
              <li>✓ Công thức, mua hàng, giờ vàng</li>
              {key !== "free" && (
                <>
                  <li>✓ AI đổi món theo nhu cầu</li>
                  <li>✓ Danh sách đi chợ tự động</li>
                </>
              )}
              {key === "plus" && (
                <>
                  <li>✓ Tủ lạnh và nhắc hạn dùng</li>
                  <li>✓ Tận dụng nguyên liệu có sẵn</li>
                  <li>✓ So sánh giỏ hàng</li>
                  <li>✓ Phân tích chi tiêu nâng cao</li>
                </>
              )}
            </ul>
            {key === "free" ? (
              <Link
                className="block border rounded-xl p-3 text-center"
                href="/meal-plan/ai"
              >
                Dùng thử thực đơn
              </Link>
            ) : (
              <button
                disabled={busy || !info?.checkout?.available || !method}
                onClick={() => buy(key)}
                className="w-full rounded-xl bg-lime-300 text-emerald-950 p-3 font-bold disabled:opacity-50"
              >
                {busy ? "Đang xử lý…" : !info?.checkout?.available ? "Chưa mở đăng ký" : "Đăng ký " + p.name}
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600">
        Không tự động thu tiền. Mua thêm sẽ nối tiếp thời hạn hiện tại. Lượt dư
        không cộng dồn. Miễn phí được cấp lượt thực đơn vào thứ Hai; lượt chat
        đặt lại lúc 00:00 giờ Việt Nam.
      </p>
      <div className="flex gap-4 flex-wrap">
        <Link href="/meal-plan/ai" className="underline">
          Thực đơn AI
        </Link>
        <Link href="/pantry" className="underline">
          Tủ lạnh của tôi
        </Link>
        <Link href="/insights" className="underline">
          Phân tích chi tiêu
        </Link>
      </div>
      {info && (
        <section className="space-y-3">
          <h2 className="text-xl font-bold">Lịch sử đăng ký</h2>
          {info.history.map((h) => (
            <p key={h._id} className="border rounded-xl p-4">
              {PLANS[h.plan].name} ·{" "}
              {h.source === "payment" ? "Đã thanh toán" : "Admin cấp"} ·{" "}
              {new Date(h.startsAt).toLocaleDateString("vi-VN")} –{" "}
              {new Date(h.endsAt).toLocaleDateString("vi-VN")}{" "}
              {h.revokedAt ? "· Đã thu hồi" : ""}
            </p>
          ))}
          {info.purchases.map((p) => (
            <Link
              key={p.orderId}
              href={"/payment/" + p.orderId}
              className="block underline"
            >
              {p.total.toLocaleString("vi-VN")}đ ·{" "}
              {p.paymentStatus === "paid"
                ? "Đã thanh toán"
                : "Xem / kiểm tra thanh toán"}
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
