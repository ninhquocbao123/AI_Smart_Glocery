"use client";
import UserPageHeader from "@/components/ui/UserPageHeader";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
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
      <UserPageHeader eyebrow="KHÁM PHÁ MÓN VIỆT" title="Hôm nay mình nấu món gì?" description="Tìm một món quen, thử một vị mới. Công thức và nguyên liệu được chuẩn bị sẵn cho bữa cơm nhà." action={<Link href="/meal-plan/ai" className="btn-filled">Tạo thực đơn AI →</Link>}/>
      <div data-user-toolbar className="flex gap-3 flex-wrap">
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
        {list.length} món ăn · Giá nguyên liệu tham khảo
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
      <p className="text-xs text-on-surface-variant">Ảnh tham khảo cách trình bày món ăn. <Link href="/photo-credits" className="underline underline-offset-4">Nguồn ảnh</Link></p>
    </div>
  );
}
