"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Sparkles,
  Leaf,
  Clock,
} from "lucide-react";
export default function MemberDiscovery({ home = false }: { home?: boolean }) {
  return (
    <section className="w-full max-w-6xl mx-auto space-y-6 text-left">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#123d2c] text-white p-7 sm:p-10">
        <div className="absolute -right-16 -top-20 w-72 h-72 rounded-full bg-lime-300/10" />
        <div className="relative grid md:grid-cols-[1.3fr_1fr] gap-8 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-lime-200 text-xs font-bold tracking-widest">
              <Leaf size={16} /> MỖI NGÀY MỘT CHÚT DỄ DÀNG HƠN
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight mt-4">
              {home
                ? "Hôm nay ăn gì?\nĐể AI gợi ý cho bạn."
                : "Từ “ăn gì hôm nay?”\nđến một bữa cơm có kế hoạch."}
            </h2>
            <p className="mt-4 text-emerald-100 leading-relaxed">
              Chọn ngân sách và khẩu phần, nhận thực đơn phù hợp. Bắt đầu với 3
              lượt chat mỗi ngày và 1 thực đơn cho 1 ngày mỗi tuần miễn phí.
            </p>
            <Link
              href={home ? "/meal-plan/ai" : "/auth/register"}
              className="inline-flex items-center gap-3 mt-6 px-5 py-3 rounded-xl bg-lime-300 text-emerald-950 font-bold hover:bg-lime-200"
            >
              {home ? "Tạo thực đơn của tôi" : "Bắt đầu miễn phí"}
              <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="rounded-2xl bg-white/10 border border-white/15 p-5 space-y-4">
            <p className="text-xs uppercase tracking-widest text-lime-200">
              Một quy trình, ít băn khoăn hơn
            </p>
            {[
              ["01", "Chọn nhu cầu", "Số người, ngân sách và món bạn thích."],
              ["02", "Nhận thực đơn", "Công thức rõ ràng, chi phí tham khảo."],
              [
                "03",
                "Chuẩn bị đi chợ",
                "VIP tổng hợp nguyên liệu thành danh sách.",
              ],
            ].map(([n, title, desc]) => (
              <div key={n} className="flex gap-4">
                <span className="text-lime-200 font-bold">{n}</span>
                <div>
                  <h3 className="font-bold">{title}</h3>
                  <p className="text-sm text-emerald-100 mt-1">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            name: "Miễn phí",
            price: "0đ",
            desc: "Khám phá món ngon và thử lên thực đơn AI.",
            icon: Sparkles,
          },
          {
            name: "VIP",
            price: "19.000đ / 30 ngày",
            desc: "Thực đơn đến 3 ngày, đổi món và danh sách đi chợ.",
            icon: CalendarDays,
          },
          {
            name: "VIP Plus",
            price: "39.000đ / 30 ngày",
            desc: "Thực đơn tuần, tủ lạnh và phân tích chi tiêu.",
            icon: Leaf,
          },
        ].map(({ name, price, desc, icon: Icon }) => (
          <Link
            key={name}
            href="/membership"
            className="group bg-white border border-emerald-100 rounded-2xl p-6 hover:border-emerald-500 hover:shadow-md transition-all"
          >
            <Icon className="text-emerald-700" size={24} />
            <div className="flex justify-between items-center mt-4">
              <h3 className="font-bold text-xl">{name}</h3>
              <ArrowUpRight
                className="text-emerald-700 group-hover:translate-x-1 transition-transform"
                size={18}
              />
            </div>
            <p className="font-bold text-emerald-700 mt-2">{price}</p>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{desc}</p>
          </Link>
        ))}
      </div>
      <Link
        href="/deals"
        className="flex flex-wrap gap-4 items-center justify-between rounded-2xl bg-[#fff4dd] border border-amber-200 p-5"
      >
        <span className="flex items-center gap-3">
          <Clock className="text-amber-700" />
          <span>
            <b className="block">Khám phá giờ vàng mỗi ngày</b>
            <span className="text-sm text-gray-600">
              Xem lịch ưu đãi và giá hiện hành tại trang Deals.
            </span>
          </span>
        </span>
        <span className="font-bold text-amber-900">Xem ưu đãi →</span>
      </Link>
    </section>
  );
}
