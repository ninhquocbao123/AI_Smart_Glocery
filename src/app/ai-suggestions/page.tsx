"use client";
import { useState } from "react";
import Link from "next/link";
import { Sparkles, Clock, Users } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { recipeCost } from "@/lib/recommendations";
import { useRecommendations } from "@/lib/use-recommendations";
import { storeDirectory } from "@/lib/stores";
import { formatVND } from "@/lib/priceUtils";
import RecipeImage from "@/components/ui/RecipeImage";
export default function SuggestionsPage() {
  const { state } = useAppContext();
  const [sort, setSort] = useState("ai");
  const [store,setStore] = useState<string>(state.selectedStore ?? "Winmart");
  const result = useRecommendations(state.userBudget, state.servings, store);
  const list = [...result.recipes];
  if(sort === "price") list.sort((a,b)=>recipeCost(a,state.servings)-recipeCost(b,state.servings));
  if (sort === "time")
    list.sort((a, b) => a.prepTime + a.cookTime - b.prepTime - b.cookTime);
  return (
    <div className="space-y-6">
      <Link href="/dashboard" className="text-primary">
        ← Điều chỉnh ngân sách
      </Link>
      <div className="rounded-3xl bg-primary-container/50 p-8">
        <Sparkles className="text-primary mb-3" />
        <p className="text-sm text-primary font-bold">GỢI Ý THÔNG MINH</p>
        <h1 className="text-3xl font-extrabold mt-2">Bữa ngon vừa túi tiền</h1>
        <p className="mt-3">
          {formatVND(state.userBudget)} · {state.servings} người ·{" "}
          {state.user?.diet ?? "Không hạn chế"}
        </p>
        <p className="text-sm text-on-surface-variant mt-3">
          {result.loading ? "Đang chọn món phù hợp cho bữa ăn của bạn…" : `Có ${list.length} món phù hợp. Mỗi món là một lựa chọn riêng trong ngân sách, chưa gồm phí giao hàng.`}
        </p>
      </div>
      <div className="flex justify-between gap-4 flex-wrap">
        <p className="text-sm text-on-surface-variant max-w-2xl">
          {result.message} {result.priceSource === "reference" ? "Giá nguyên liệu tham khảo, chưa đồng bộ với siêu thị." : "Giá từ bảng giá cửa hàng do nhóm quản lý."}
        </p>
        <label className="text-sm">
          Sắp xếp{" "}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border rounded-xl p-2 bg-surface"
          >
            <option value="ai">Thứ tự đề xuất</option>
            <option value="price">Chi phí thấp nhất</option>
            <option value="time">Nấu nhanh nhất</option>
          </select>
        </label>
      </div>
      <label className="block">Cửa hàng tham khảo <select value={store} onChange={e=>setStore(e.target.value)} className="border rounded-xl p-2">{storeDirectory.map(s=><option key={s.key} value={s.key}>{s.name}</option>)}</select></label>
      {result.loading && <div role="status" className="rounded-2xl bg-white p-8 text-center text-primary"><Sparkles className="mx-auto mb-3 animate-pulse" />Đang tìm món ngon vừa túi tiền cho bạn…</div>}
      {result.error && <p role="alert" className="text-error">{result.error}</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((r) => (
          <Link
            key={r.id}
            href={"/meal-plan/" + r.id}
            className="card-outlined overflow-hidden hover:shadow-lg transition-shadow"
          >
            <RecipeImage
              recipeId={r.id}
              src={r.image}
              alt={r.title}
              variant="card"
            />
            <div className="p-5 space-y-3">
              <h2 className="text-lg font-bold">{r.title}</h2>
              <p className="text-sm text-on-surface-variant line-clamp-2">
                {r.description}
              </p>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={15} />
                {r.prepTime + r.cookTime} phút
                <Users size={15} />
                {state.servings} người
              </div>
              <p className="text-xl font-extrabold text-primary">
                {formatVND(recipeCost(r, state.servings))}
              </p>
              <p className="text-xs text-on-surface-variant">
                Còn{" "}
                {formatVND(state.userBudget - recipeCost(r, state.servings))}{" "}
                trong ngân sách
              </p>
              <span className="text-sm font-bold text-primary">
                Xem cách nấu & nguyên liệu →
              </span>
            </div>
          </Link>
        ))}
      </div>
      {!result.loading && !result.error && !list.length && (
        <div className="card-outlined p-12 text-center">
          <h2 className="text-xl font-bold">Chưa có món phù hợp</h2>
          <p className="my-3 text-on-surface-variant">
            Thử tăng ngân sách hoặc giảm số người. Các nguyên liệu cần tránh vẫn
            được giữ nguyên.
          </p>
          <Link href="/dashboard" className="btn-filled">
            Điều chỉnh ngân sách
          </Link>
        </div>
      )}
    </div>
  );
}
