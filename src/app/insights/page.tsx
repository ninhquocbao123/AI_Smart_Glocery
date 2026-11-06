"use client";
import PlusFeature from "@/components/PlusFeature";
import UserPageHeader from "@/components/ui/UserPageHeader";

import { useEffect, useState } from "react";
import Link from "next/link";
type Data = {
  current: number;
  previous: number;
  delivery: number;
  categories: Record<string, number>;
  weeks: Record<string, number>;
  budget: number;
  count: number;
};
function InsightsContent() {
  const [data, setData] = useState<Data | null>(null),
    [error, setError] = useState("");
  useEffect(() => {
    fetch("/api/insights")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.message);
        setData(d);
      })
      .catch((e) => setError(e.message));
  }, []);
  const money = (n: number) => Math.round(n).toLocaleString("vi-VN") + "đ";
  return (
    <div className="space-y-6">
      <UserPageHeader eyebrow="VIP PLUS · PHÂN TÍCH CHI TIÊU" title="Hiểu rõ từng khoản chi" description="Theo dõi đơn thực phẩm đã thanh toán thật, không bao gồm đơn hủy và phí đăng ký gói." action={<Link href="/budget" className="btn-outlined">Ngân sách của tôi →</Link>}/>
      {error && (
        <p role="alert">
          {error}{" "}
          <Link href="/membership" className="underline">
            Xem gói thành viên
          </Link>
        </p>
      )}
      {data && (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              ["Tháng này", money(data.current)],
              ["Tháng trước (cả tháng)", money(data.previous)],
              ["Ngân sách còn lại", money(data.budget - data.current)],
            ].map(([label, value]) => (
              <div key={label} className="border bg-white rounded-2xl p-6">
                <p>{label}</p>
                <b className="text-2xl text-emerald-700">{value}</b>
              </div>
            ))}
          </div>
          {!data.count ? (
            <p>
              Chưa có đơn thanh toán thật trong tháng. Hãy quay lại khi có dữ
              liệu.
            </p>
          ) : (
            <>
              <p>
                {data.budget > 0
                  ? `Đã dùng ${Math.round((data.current / data.budget) * 100)}% ngân sách tháng.`
                  : "Đặt ngân sách trong hồ sơ để theo dõi tốt hơn."}{" "}
                Phí giao hàng: {money(data.delivery)}.
              </p>
              <section className="bg-white border rounded-2xl p-6 space-y-4">
                <h2 className="text-xl font-bold">Theo nhóm thực phẩm</h2>
                {Object.entries(data.categories).map(([name, value]) => (
                  <div key={name}>
                    <div className="flex justify-between">
                      <span>{name}</span>
                      <span>{money(value)}</span>
                    </div>
                    <div className="h-3 rounded-full bg-emerald-50 mt-2">
                      <div
                        className="h-3 bg-emerald-600 rounded-full"
                        style={{
                          width:
                            Math.min(
                              100,
                              (value /
                                Math.max(1, data.current - data.delivery)) *
                                100,
                            ) + "%",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </section>
              <section data-user-panel className="border rounded-2xl p-6 space-y-3">
                <h2 className="font-bold text-xl">
                  Chi tiêu theo tuần trong tháng
                </h2>
                {Object.entries(data.weeks).map(([w, v]) => (
                  <p key={w}>
                    {w}: {money(v)}
                  </p>
                ))}
              </section>
              <p>
                {data.current > data.budget && data.budget > 0
                  ? "Bạn đã vượt ngân sách. Thử tạo thực đơn với mức chi thấp hơn và kiểm tra nguyên liệu có sẵn trước khi mua."
                  : "Tận dụng nguyên liệu trong tủ lạnh và so sánh chi phí giỏ hàng trước khi đặt."}
              </p>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default function Insights(){return <PlusFeature><InsightsContent/></PlusFeature>;}
