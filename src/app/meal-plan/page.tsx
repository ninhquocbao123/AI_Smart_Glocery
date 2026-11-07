"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Sparkles, ChefHat, Clock, X, SlidersHorizontal } from "lucide-react";
import UserPageHeader from "@/components/ui/UserPageHeader";
import { useCatalogRecipes } from "@/lib/use-catalog-recipes";
import RecipeCard from "@/components/dashboard/RecipeCard";

export default function RecipesPage() {
  const recipes = useCatalogRecipes();
  const [query, setQuery] = useState("");
  const [quickOnly, setQuickOnly] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Tất cả");

  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/đ/g, "d");

  const list = recipes.filter((r) => {
    const isVietnamese = r.cuisine === "Việt Nam";
    const matchesQuery = normalize(
      r.title + " " + r.ingredients.map((i) => i.name).join(" "),
    ).includes(normalize(query));
    const matchesQuick = !quickOnly || r.prepTime + r.cookTime <= 30;
    const matchesDifficulty =
      selectedDifficulty === "Tất cả" || r.difficulty === selectedDifficulty;

    return isVietnamese && matchesQuery && matchesQuick && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      <UserPageHeader
        eyebrow="KHÁM PHÁ MÓN VIỆT"
        title="Hôm nay mình nấu món gì?"
        description="Tìm một món quen, thử một vị mới. Công thức chuẩn vị và nguyên liệu tươi ngon được chuẩn bị sẵn cho bữa cơm gia đình bạn."
        action={
          <Link
            href="/meal-plan/ai"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition-all shadow-emerald-700/20"
          >
            <Sparkles size={16} />
            <span>Tạo thực đơn AI →</span>
          </Link>
        }
      />

      {/* ── Toolbar: Search & Category Chips ── */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Search bar */}
          <div className="flex-1 min-w-[260px] flex items-center gap-2.5 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
            <Search size={18} className="text-slate-400 shrink-0" />
            <input
              aria-label="Tìm món hoặc nguyên liệu"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Tìm theo tên món (thịt kho, canh chua) hoặc nguyên liệu…"
              className="outline-none w-full bg-transparent text-sm text-slate-800 font-medium placeholder:text-slate-400"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Xóa từ khóa"
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Toggle: Under 30 mins */}
          <button
            type="button"
            aria-pressed={quickOnly}
            onClick={() => setQuickOnly(!quickOnly)}
            className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
              quickOnly
                ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Clock size={16} />
            <span>Nấu dưới 30 phút</span>
          </button>
        </div>

        {/* Difficulty Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
            <SlidersHorizontal size={13} /> Độ khó:
          </span>
          {["Tất cả", "Dễ", "Trung bình", "Khó"].map((diff) => (
            <button
              key={diff}
              type="button"
              onClick={() => setSelectedDifficulty(diff)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedDifficulty === diff
                  ? "bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/30 font-extrabold"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count & Note */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1">
        <span>
          Hiển thị <strong>{list.length}</strong> món ăn Việt Nam · Giá nguyên liệu tham khảo
        </span>
        <span className="text-emerald-700">Giá cập nhật theo siêu thị</span>
      </div>

      {/* Recipe Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {list.map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            index={index}
            variant="grid"
          />
        ))}
      </div>

      {/* Empty State */}
      {!list.length && (
        <div className="bg-white border border-slate-200 rounded-3xl p-14 text-center max-w-lg mx-auto shadow-sm">
          <ChefHat size={40} className="mx-auto text-slate-400 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">
            Chưa tìm thấy món ăn phù hợp
          </h3>
          <p className="text-slate-500 text-sm mb-5">
            Thử tìm kiếm với tên món khác hoặc tắt bộ lọc &quot;Nấu dưới 30 phút&quot;.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setQuickOnly(false);
              setSelectedDifficulty("Tất cả");
            }}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 text-white font-bold text-sm shadow hover:bg-emerald-800 transition-all"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {/* Photo Credits Note */}
      <p className="text-xs text-slate-400 text-center pt-4">
        Hình ảnh minh họa cách trình bày món ăn.{" "}
        <Link
          href="/photo-credits"
          className="underline underline-offset-4 text-emerald-700 hover:text-emerald-800"
        >
          Nguồn ảnh & Bản quyền
        </Link>
      </p>
    </div>
  );
}
