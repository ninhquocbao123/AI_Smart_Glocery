"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Crown, Sparkles, ArrowRight } from "lucide-react";
import { PLANS, type Plan } from "@/lib/membership";

export default function MembershipStatus() {
  const [data, setData] = useState<{
    plan: Plan;
    endsAt?: string;
    chatRemaining: number;
    mealRemaining: number;
  } | null>(null);

  useEffect(() => {
    fetch("/api/membership")
      .then((r) => (r.ok ? r.json() : null))
      .then(setData)
      .catch(() => {});
  }, []);

  const isVip = data?.plan === "vip" || data?.plan === "plus";

  return (
    <Link
      href="/membership"
      className="group block border border-emerald-200/90 bg-gradient-to-br from-emerald-50/90 to-teal-50/50 hover:from-emerald-50 hover:to-teal-50 p-5 rounded-2xl transition-all duration-200 hover:shadow-md hover:border-emerald-300"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
            <Crown size={17} className={isVip ? "fill-amber-300 text-amber-300" : ""} />
          </div>
          <div>
            <strong className="text-sm font-bold text-emerald-950 block">
              {data ? PLANS[data.plan]?.name : "Gói thành viên"}
            </strong>
            <span className="text-[11px] font-semibold text-emerald-700">
              {isVip ? "Đang hoạt động" : "Nâng cấp lên VIP Plus"}
            </span>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          Chi tiết & Lượt AI <ArrowRight size={14} />
        </span>
      </div>

      {data && (
        <div className="mt-3.5 pt-3 border-t border-emerald-200/70 flex items-center justify-between text-xs text-emerald-900 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 font-bold text-emerald-800">
              <Sparkles size={12} className="text-emerald-600" />
              {data.chatRemaining} lượt hỏi AI
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/80 font-bold text-emerald-800">
              {data.mealRemaining} lượt lên thực đơn
            </span>
          </div>
          {data.endsAt && (
            <span className="text-[11px] text-emerald-700">
              Hết hạn:{" "}
              {new Date(data.endsAt).toLocaleDateString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
              })}
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
