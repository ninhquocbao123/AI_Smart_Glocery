"use client";
import Link from "next/link";
import BudgetCard from "@/components/dashboard/BudgetCard";
import RecipeCarousel from "@/components/dashboard/RecipeCarousel";
import { useCatalogRecipes } from "@/lib/use-catalog-recipes";
import { useAppContext } from "@/context/AppContext";
export default function DashboardPage() {
  const recipes = useCatalogRecipes();
  const { state } = useAppContext();
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-primary font-semibold">
          CHÀO {state.user?.name.toUpperCase()}
        </p>
        <h1 className="text-3xl font-extrabold mt-2">
          Bữa cơm ngon, chi tiêu gọn.
        </h1>
        <p className="mt-2 text-on-surface-variant">
          Hôm nay bạn muốn dành bao nhiêu tiền để nấu ăn?
        </p>
      </div>
      <BudgetCard />
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          ["/budget", "Ví tiền tháng này", "Xem đã mua gì, tại cửa hàng nào"],
          ["/deals", "Ưu đãi nguyên liệu", "Tham khảo thực phẩm đang giảm giá"],
          ["/orders", "Đơn hàng của bạn", "Theo dõi đơn và mua lại nhanh"],
        ].map(([href, title, desc]) => (
          <Link
            key={href}
            href={href}
            className="card-outlined p-5 hover:border-primary"
          >
            <h2 className="font-bold text-primary">{title} →</h2>
            <p className="text-sm text-on-surface-variant mt-2">{desc}</p>
          </Link>
        ))}
      </div>
      <RecipeCarousel
        icon={<span>🍲</span>}
        title="Món cơm nhà dễ nấu"
        subtitle="Công thức Việt quen thuộc cho những ngày bận rộn"
        recipes={recipes.filter((r) => r.prepTime + r.cookTime <= 30)}
      />
      <p className="text-xs text-on-surface-variant text-center">
        Dự án demo EXE202 · Giá thực phẩm tham khảo, chưa kết nối siêu thị.
      </p>
    </div>
  );
}

