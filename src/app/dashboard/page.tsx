"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  ArrowUpRight,
  Refrigerator,
  Tag,
  CalendarDays,
  ChefHat,
  Wallet,
  Package,
  ShoppingBasket,
  ArrowRight,
  Clock,
  Shuffle,
  Flame,
  UtensilsCrossed,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";
import GoldenHourBanner from "@/components/dashboard/GoldenHourBanner";
import MembershipStatus from "@/components/MembershipStatus";
import BudgetCard from "@/components/dashboard/BudgetCard";
import RecipeCarousel from "@/components/dashboard/RecipeCarousel";
import { useCatalogRecipes } from "@/lib/use-catalog-recipes";
import { useAppContext } from "@/context/AppContext";
import { formatVND } from "@/lib/priceUtils";
import styles from "@/components/dashboard/Home.module.css";

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 11) return { text: "Chào buổi sáng", icon: Sun, label: "Khởi đầu ngày mới với bữa ăn đủ chất" };
  if (hour < 14) return { text: "Chào buổi trưa", icon: Sun, label: "Nạp năng lượng cho buổi chiều năng động" };
  if (hour < 18) return { text: "Chào buổi chiều", icon: Sunset, label: "Chuẩn bị bữa cơm ấm cúng tối nay" };
  return { text: "Chào buổi tối", icon: Moon, label: "Thư giãn bên mâm cơm gia đình chuẩn vị" };
}

const CATEGORIES = [
  { id: "all", label: "Tất cả gợi ý" },
  { id: "quick", label: "Nấu nhanh dưới 30p" },
  { id: "rice", label: "Món cơm & sườn" },
  { id: "soup", label: "Món canh thanh nhiệt" },
  { id: "braised", label: "Món kho & mặn" },
];

export default function DashboardPage() {
  const recipes = useCatalogRecipes();
  const { state, cartItemCount } = useAppContext();
  const greeting = getTimeGreeting();
  const GreetingIcon = greeting.icon;
  const userName = state.user?.name || "bạn";

  const [activeCategory, setActiveCategory] = useState("all");
  const [featuredIndex, setFeaturedIndex] = useState(1);

  // Pool of appealing dishes for the Hero Rotator
  const heroDishes = recipes.length > 0 ? recipes.slice(0, 8) : [];
  const currentDish = heroDishes[featuredIndex % Math.max(heroDishes.length, 1)] || {
    id: "recipe-002",
    title: "Cơm sườn nướng mật ong",
    image: "/images/food/recipe-002.webp",
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    totalPrice: 65000,
    difficulty: "Dễ",
  };

  const handleShuffleDish = () => {
    setFeaturedIndex((prev) => (prev + 1) % Math.max(heroDishes.length, 1));
  };

  // Filter recipes for carousel based on category
  const filteredRecipes = recipes.filter((r) => {
    if (activeCategory === "quick") return r.prepTime + r.cookTime <= 30;
    if (activeCategory === "rice") return r.title.toLowerCase().includes("cơm") || r.title.toLowerCase().includes("sườn");
    if (activeCategory === "soup") return r.title.toLowerCase().includes("canh");
    if (activeCategory === "braised") return r.title.toLowerCase().includes("kho") || r.title.toLowerCase().includes("ram");
    return true;
  });

  return (
    <div className={styles.home}>
      {/* ── Live Golden Hour Banner ── */}
      <GoldenHourBanner />

      {/* ── Hero Showcase Section ── */}
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrowBadge}>
            <GreetingIcon size={14} className="text-emerald-300" />
            <span>TRỢ LÝ ẨM THỰC & ĐI CHỢ AI</span>
          </div>

          <h1 className={styles.heroHeading}>
            <span className={styles.heroGreetingRow}>{greeting.text}, {userName}!</span>
            <span className={styles.heroQuestionRow}>Hôm nay mình ăn gì nhỉ?</span>
          </h1>

          <p className={styles.heroTagline}>
            {greeting.label}. AI Smart Grocery tự động cân đối dinh dưỡng,
            tận dụng nguyên liệu trong tủ lạnh và tìm giỏ hàng siêu thị tối ưu nhất.
          </p>

          {/* Clean Feature Highlights */}
          <div className={styles.heroHighlights}>
            <div className={styles.highlightPill}>
              <Sparkles size={13} className="text-amber-300" />
              <span>Gợi ý chuẩn vị</span>
            </div>
            <div className={styles.highlightPill}>
              <Refrigerator size={13} className="text-emerald-300" />
              <span>Tận dụng tủ lạnh</span>
            </div>
            <div className={styles.highlightPill}>
              <Tag size={13} className="text-cyan-300" />
              <span>Tiết kiệm đến 30%</span>
            </div>
          </div>

          <div className={styles.heroActions}>
            <Link href="/meal-plan/ai" className={styles.heroPrimaryBtn}>
              <Sparkles size={16} />
              <span>Nhờ AI lên thực đơn</span>
            </Link>

            <Link href="/meal-plan" className={styles.heroSecondaryBtn}>
              <UtensilsCrossed size={16} />
              <span>Khám phá 50+ món</span>
              <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>

        {/* ── Right: Interactive Prominent Featured Dish Showcase ── */}
        <div className={styles.heroFeaturedCard}>
          <div className={styles.heroDishImageWrap}>
            <Image
              src={currentDish.image || "/images/food/recipe-002.webp"}
              alt={currentDish.title}
              fill
              sizes="(max-width: 1024px) 100vw, 700px"
              className={styles.dishHeroImage}
              priority
            />
            <div className={styles.heroPhotoGradient} />
          </div>

          {/* Top Right: Minimal Interactive Shuffle */}
          <div className={styles.featuredTopBar}>
            <button
              type="button"
              onClick={handleShuffleDish}
              className={styles.shuffleBtn}
              title="Bấm để đổi sang món ngon khác"
            >
              <Shuffle size={12} />
              <span>Đổi món 🎲</span>
            </button>
          </div>

          {/* Bottom Floating Glass Capsule — Ultra sleek & compact, leaves 95% of dish visible */}
          <div className={styles.compactDishPill}>
            <div className={styles.dishPillLeft}>
              <span className={styles.compactDishTitle}>{currentDish.title}</span>
              <span className={styles.compactDishMeta}>· {currentDish.prepTime + currentDish.cookTime}p</span>
            </div>

            <div className={styles.dishPillRight}>
              <span className={styles.compactDishCost}>{formatVND(currentDish.totalPrice)}</span>
              <Link href={`/meal-plan/${currentDish.id}`} className={styles.compactCookBtn} title="Xem công thức chi tiết">
                <span>Xem</span>
                <ArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-Column Bento Control Row: [Vertical Shortcuts (Left)] + [Budget Estimator] + [Account & VIP] ── */}
      <div className={styles.bentoControlRow}>
        {/* Column 1: Vertical Shortcuts on Left (Hình số 3) */}
        <div className={styles.verticalShortcutsCol}>
          {/* Card 1: Lịch bữa ăn */}
          <Link href="/meal-plan/weekly" className={styles.verticalQuickCard} data-tone="emerald">
            <div className={styles.quickIconBox}>
              <CalendarDays size={18} strokeWidth={1.8} />
            </div>
            <div className={styles.quickCardBody}>
              <div className={styles.quickCardTitle}>
                <span>Lịch bữa ăn tuần</span>
                <ArrowUpRight size={13} className={styles.quickArrow} />
              </div>
              <p className={styles.quickCardDesc}>
                Lên thực đơn 7 ngày chống ngấy.
              </p>
            </div>
          </Link>

          {/* Card 2: Tủ lạnh thông minh */}
          <Link href="/pantry" className={styles.verticalQuickCard} data-tone="blue">
            <div className={styles.quickIconBox}>
              <Refrigerator size={18} strokeWidth={1.8} />
            </div>
            <div className={styles.quickCardBody}>
              <div className={styles.quickCardTitle}>
                <span>Tủ lạnh thông minh</span>
                <ArrowUpRight size={13} className={styles.quickArrow} />
              </div>
              <p className={styles.quickCardDesc}>
                Kiểm tra hạn & tận dụng đồ sẵn có.
              </p>
            </div>
          </Link>

          {/* Card 3: Ưu đãi giờ vàng */}
          <Link href="/deals" className={styles.verticalQuickCard} data-tone="amber">
            <div className={styles.quickIconBox}>
              <Tag size={18} strokeWidth={1.8} />
            </div>
            <div className={styles.quickCardBody}>
              <div className={styles.quickCardTitle}>
                <span>Ưu đãi giờ vàng</span>
                <ArrowUpRight size={13} className={styles.quickArrow} />
              </div>
              <p className={styles.quickCardDesc}>
                Săn sale WinMart, BHX giảm 35%.
              </p>
            </div>
          </Link>

          {/* Card 4: Giỏ nguyên liệu */}
          <Link href="/grocery-store" className={styles.verticalQuickCard} data-tone="purple">
            <div className={styles.quickIconBox}>
              <ShoppingBasket size={18} strokeWidth={1.8} />
            </div>
            <div className={styles.quickCardBody}>
              <div className={styles.quickCardTitle}>
                <span>Giỏ nguyên liệu</span>
                <ArrowUpRight size={13} className={styles.quickArrow} />
              </div>
              <p className={styles.quickCardDesc}>
                {cartItemCount > 0
                  ? `${cartItemCount} món đang chờ đi chợ.`
                  : "Gộp theo siêu thị rẻ nhất."}
              </p>
            </div>
          </Link>
        </div>

        {/* Column 2: Budget Estimator Card */}
        <BudgetCard />

        {/* Column 3: Account & VIP Management Card */}
        <section className={styles.account}>
          <div className={styles.sectionTitle}>
            <div className={styles.titleIconBox}>
              <Sparkles size={19} strokeWidth={2} />
            </div>
            <div>
              <h2>Tài khoản & Tiện ích</h2>
              <p>Quản lý lượt dùng AI & đơn hàng.</p>
            </div>
          </div>

          <div className={styles.accountContent}>
            <MembershipStatus />

            <div className={styles.accountLinks}>
              <Link href="/budget" className={styles.accountActionLink}>
                <Wallet size={16} className="text-emerald-700" />
                <span>Đặt hạn mức ngân sách tháng</span>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>
              <Link href="/orders" className={styles.accountActionLink}>
                <Package size={16} className="text-emerald-700" />
                <span>Xem trạng thái đơn hàng đã đặt</span>
                <ArrowRight size={14} className="text-slate-400" />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* ── Full Width Recipe Showcase with Interactive Category Switcher ── */}
      <section className={styles.recipesSection}>
        <div className={styles.recipeTop}>
          <div>
            <span className={styles.recipeSectionBadge}>GỢI Ý HÔM NAY CHO BẠN</span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              Thực đơn ngon miệng, nấu nhanh chuẩn vị
            </h2>
          </div>
          <Link href="/meal-plan" className={styles.recipeExploreAll}>
            <span>Xem tất cả {recipes.length} công thức</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className={styles.recipeCategoryTabs}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`${styles.catTabBtn} ${activeCategory === cat.id ? styles.catTabActive : ""}`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <RecipeCarousel
          icon={<ChefHat size={20} className="text-emerald-700" />}
          title={
            activeCategory === "quick"
              ? "Món ngon nấu dưới 30 phút"
              : activeCategory === "rice"
              ? "Cơm nhà đậm đà, chắc bụng"
              : activeCategory === "soup"
              ? "Canh thanh nhiệt giải ngấy"
              : "Công thức quen thuộc, nguyên liệu sẵn có"
          }
          subtitle="Nguyên liệu tươi ngon có sẵn tại các siêu thị đối tác gần bạn."
          recipes={filteredRecipes.length > 0 ? filteredRecipes : recipes}
        />

        {recipes.length === 0 && (
          <p className="text-sm text-slate-500 py-8 text-center">
            Đang tải dữ liệu thực đơn từ hệ thống…
          </p>
        )}
      </section>
    </div>
  );
}
