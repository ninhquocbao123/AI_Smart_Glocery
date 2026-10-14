"use client";
import { useState } from "react";
import Link from "next/link";
import { Search, ChefHat } from "lucide-react";
import { useCatalogRecipes } from "@/lib/use-catalog-recipes";
import RecipeCard from "@/components/dashboard/RecipeCard";
export default function RecipesPage() {
  const recipes = useCatalogRecipes();
  const [query, setQuery] = useState("");
  const [quick, setQuick] = useState(false);
  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/đ/g, "d");
  const list = recipes.filter(
    (r) =>
      r.cuisine === "Việt Nam" &&
      normalize(
        r.title + " " + r.ingredients.map((i) => i.name).join(" "),
      ).includes(normalize(query)) &&
      (!quick || r.prepTime + r.cookTime <= 30),
  );
  return (
    <div className="space-y-6">
      <p className="text-xs text-on-surface-variant">Ảnh món ăn và sản phẩm mang tính minh họa, gồm ảnh chụp và ảnh tạo bằng AI. <a href="/images/food/credits.html" className="underline">Nguồn ảnh</a></p>
      <div className="rounded-3xl bg-primary-container/50 p-8">
        <ChefHat className="text-primary mb-3" />
        <p className="text-sm font-bold text-primary">
          SMART CART · BẾP VIỆT MỖI NGÀY
        </p>
        <h1 className="text-3xl font-extrabold mt-2">
          Hôm nay mình nấu món gì?
        </h1>
        <p className="mt-3 text-on-surface-variant">
          Khám phá món Việt quen thuộc, xem công thức và chọn nguyên liệu cho
          bữa cơm nhà.
        </p>
        <Link
          href="/dashboard"
          className="inline-block mt-4 text-primary font-bold underline"
        >
          Gợi ý riêng theo ngân sách →
        </Link>
      </div>
      <div className="flex gap-3 flex-wrap">
        <label className="flex items-center gap-2 bg-surface border border-outline-variant rounded-xl px-4 py-3 flex-1">
          <Search size={18} />
          <input
            aria-label="Tìm món hoặc nguyên liệu"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm món hoặc nguyên liệu…"
            className="outline-none w-full bg-transparent"
          />
        </label>
        <button
          aria-pressed={quick}
          onClick={() => setQuick(!quick)}
          className={quick ? "btn-filled" : "btn-outlined"}
        >
          Nấu trong 30 phút
        </button>
      </div>
      <p className="text-sm text-on-surface-variant">
        {list.length} món ăn · Giá nguyên liệu tham khảo cho bản demo
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((recipe, index) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            index={index}
            variant="grid"
          />
        ))}
      </div>
      {!list.length && (
        <p className="p-12 text-center">
          Chưa tìm thấy món. Thử tên món hoặc nguyên liệu khác.
        </p>
      )}
    </div>
  );
}
