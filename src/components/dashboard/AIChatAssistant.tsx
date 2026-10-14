"use client";
import { useState } from "react";
import Link from "next/link";
import { MessageSquare, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { recipeCost } from "@/lib/recommendations";
import { useRecommendations } from "@/lib/use-recommendations";
import { formatVND } from "@/lib/priceUtils";
export default function AIChatAssistant() {
  const [open, setOpen] = useState(false);
  const { state } = useAppContext();
  const result = useRecommendations(state.userBudget, state.servings, state.selectedStore ?? "Winmart", open);
  const suggestions = result.recipes.slice(0,3);
  return (
    <div className="fixed right-4 bottom-24 lg:bottom-6 z-40">
      {open ? (
        <section
          aria-label="Trợ lý bữa ăn"
          className="w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-outline-variant bg-surface shadow-xl p-5 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="font-bold">Trợ lý bữa ăn</h2>
            <button aria-label="Đóng trợ lý" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </div>
          <p className="text-sm">
            Với {formatVND(state.userBudget)} cho {state.servings} người, bạn có
            thể thử:
          </p>
          {result.loading && <p role="status">Đang tìm món…</p>}
          {result.error && <p role="alert">{result.error}</p>}
          {suggestions.map((r) => (
            <Link
              key={r.id}
              href={"/meal-plan/" + r.id}
              onClick={() => setOpen(false)}
              className="block rounded-xl bg-primary-container/40 p-3 text-sm"
            >
              {r.title}
              <strong className="block text-primary">
                {formatVND(recipeCost(r, state.servings))}
              </strong>
            </Link>
          ))}
          {!suggestions.length && (
            <p className="text-sm">
              Chưa có công thức phù hợp với ngân sách và khẩu vị.
            </p>
          )}
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="block text-primary text-sm underline"
          >
            Đổi ngân sách và số người →
          </Link>
          <p className="text-xs text-on-surface-variant">
            {result.message}
          </p>
        </section>
      ) : (
        <button
          aria-label="Mở trợ lý bữa ăn"
          onClick={() => setOpen(true)}
          className="rounded-full bg-primary text-white p-4 shadow-lg"
        >
          <MessageSquare />
        </button>
      )}
    </div>
  );
}
