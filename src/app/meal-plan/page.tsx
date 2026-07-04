"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Clock,
  Users,
  ArrowLeftRight,
  ChefHat,
  Wallet,
  Filter,
  ArrowLeft,
  Flame,
  Store,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { recipes, type Recipe } from "@/data/mockData";
import { formatVND } from "@/lib/priceUtils";
import RecipeImage from "@/components/ui/RecipeImage";

// ─────────────────────────────────────────────────────────────
// Difficulty & Store Styles
// ─────────────────────────────────────────────────────────────

const difficultyStyle = {
  "Dễ": "bg-primary-container text-on-primary-container",
  "Trung bình": "bg-secondary-container text-on-secondary-container",
  "Khó": "bg-error-container text-on-error-container",
} as const;

const storeColors: Record<string, string> = {
  "Bach Hoa Xanh": "bg-[#4CAF50]/10 text-[#2E7D32]",
  Winmart: "bg-[#FF6F00]/10 text-[#E65100]",
  "Coop Food": "bg-[#1565C0]/10 text-[#0D47A1]",
};

// ─────────────────────────────────────────────────────────────
// Filter options
// ─────────────────────────────────────────────────────────────

type SortOption = "price-asc" | "price-desc" | "time-asc" | "difficulty";
const sortOptions: { value: SortOption; label: string }[] = [
  { value: "price-asc", label: "Giá thấp nhất" },
  { value: "price-desc", label: "Giá cao nhất" },
  { value: "time-asc", label: "Nấu nhanh nhất" },
  { value: "difficulty", label: "Dễ làm nhất" },
];

const difficultyOrder = { "Dễ": 0, "Trung bình": 1, "Khó": 2 };

// ─────────────────────────────────────────────────────────────
// Suggestion Card
// ─────────────────────────────────────────────────────────────

function SuggestionCard({
  recipe,
  index,
  onSwap,
  budget,
}: {
  recipe: Recipe;
  index: number;
  onSwap: (id: string) => void;
  budget: number;
}) {
  const percentOfBudget = Math.round((recipe.totalPrice / budget) * 100);
  const uniqueStores = [...new Set(recipe.ingredients.map((i) => i.store))];
  const cuisineEmoji = "🇻🇳";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/meal-plan/${recipe.id}`}>
        <div className="relative overflow-hidden rounded-2xl bg-surface border border-outline-variant hover:border-primary/30 transition-all duration-300 hover:shadow-[var(--shadow-elevation-3)] cursor-pointer">
          {/* ── Recipe Image ── */}
          <div className="relative">
            <RecipeImage
              recipeId={recipe.id}
              src={recipe.image}
              alt={recipe.title}
              variant="card"
            />

            {/* Budget % pill */}
            <div className="absolute top-3 left-3 z-10">
              <div
                className={`px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-sm ${
                  percentOfBudget <= 30
                    ? "bg-primary/90 text-on-primary"
                    : percentOfBudget <= 60
                    ? "bg-secondary/90 text-on-secondary"
                    : "bg-error/80 text-on-error"
                }`}
              >
                {percentOfBudget}% ngân sách
              </div>
            </div>

            {/* Price badge */}
            <div className="absolute top-3 right-3 z-10">
              <div className="px-3 py-1.5 rounded-xl bg-surface/90 backdrop-blur-sm shadow-sm">
                <span className="text-sm font-bold text-primary">
                  {formatVND(recipe.totalPrice)}
                </span>
              </div>
            </div>

            {/* Difficulty badge */}
            <div className="absolute bottom-3 left-3 z-10">
              <div
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${difficultyStyle[recipe.difficulty]}`}
              >
                {recipe.difficulty}
              </div>
            </div>

            {/* Bottom gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface/90 to-transparent" />
          </div>

          {/* ── Content ── */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <h3 className="text-base font-bold text-on-surface leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {recipe.title}
            </h3>

            {/* Description */}
            <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">
              {recipe.description}
            </p>

            <div className="flex items-center gap-3 text-on-surface-variant">
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">
                  {recipe.prepTime + recipe.cookTime} phút
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">
                  {recipe.servings} phần ăn
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">
                  {recipe.ingredients.length} nguyên liệu
                </span>
              </div>
            </div>

            {/* Store badges */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Store className="w-3 h-3 text-on-surface-variant flex-shrink-0" />
              {uniqueStores.map((store) => (
                <span
                  key={store}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${storeColors[store] ?? ""}`}
                >
                  {store}
                </span>
              ))}
            </div>

            {/* Quick Swap button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSwap(recipe.id);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-primary hover:bg-primary/8 hover:border-primary/30 transition-all duration-200 cursor-pointer"
              aria-label={`Đổi nguyên liệu cho ${recipe.title}`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              Đổi nguyên liệu
            </button>
          </div>

          {/* Hover glow */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-primary/[0.03] to-transparent" />
        </div>
      </Link>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Page — Screen 2
// ─────────────────────────────────────────────────────────────

export default function MealPlanPage() {
  const { state } = useAppContext();
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [swappedIds, setSwappedIds] = useState<Set<string>>(new Set());

  // Filter recipes within budget
  const affordableRecipes = useMemo(() => {
    let filtered = recipes.filter(
      (r) => r.totalPrice <= state.userBudget && !swappedIds.has(r.id)
    );

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.totalPrice - b.totalPrice);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.totalPrice - a.totalPrice);
        break;
      case "time-asc":
        filtered.sort(
          (a, b) => a.prepTime + a.cookTime - (b.prepTime + b.cookTime)
        );
        break;
      case "difficulty":
        filtered.sort(
          (a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        );
        break;
    }

    return filtered;
  }, [state.userBudget, sortBy, swappedIds]);

  // Swapped-out recipes (available for re-adding)
  const swappedRecipes = useMemo(
    () => recipes.filter((r) => swappedIds.has(r.id) && r.totalPrice <= state.userBudget),
    [swappedIds, state.userBudget]
  );

  const handleSwap = (id: string) => {
    setSwappedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalCount = recipes.filter(
    (r) => r.totalPrice <= state.userBudget
  ).length;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Trang chủ
        </Link>

        {/* Title row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
                Gợi ý thực đơn từ AI
              </h1>
              <p className="text-sm text-on-surface-variant">
                Có {affordableRecipes.length} công thức phù hợp với ngân sách{" "}
                <span className="font-semibold text-primary">
                  {formatVND(state.userBudget)}
                </span>
              </p>
            </div>
          </div>

          {/* Budget indicator */}
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-primary-container/40 border border-primary-container">
            <Wallet className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-on-primary-container">
              {formatVND(state.userBudget)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Sort / Filter Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"
      >
        <Filter className="w-4 h-4 text-on-surface-variant flex-shrink-0" />
        {sortOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSortBy(opt.value)}
            className={`
              flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold
              transition-all duration-200 cursor-pointer
              ${
                sortBy === opt.value
                  ? "bg-primary text-on-primary shadow-sm"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
              }
            `}
          >
            {opt.label}
          </button>
        ))}
      </motion.div>

      {/* ── Recipe Grid ── */}
      {affordableRecipes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {affordableRecipes.map((recipe, index) => (
            <SuggestionCard
              key={recipe.id}
              recipe={recipe}
              index={index}
              onSwap={handleSwap}
              budget={state.userBudget}
            />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card-outlined p-12 text-center"
        >
          <ChefHat className="w-16 h-16 text-on-surface-variant mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-bold text-on-surface mb-2">
            Không có công thức nào phù hợp với ngân sách
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Hãy thử tăng ngân sách hoặc khôi phục các công thức đã đổi.
          </p>
          <Link href="/" className="btn-filled">
            Điều chỉnh ngân sách
          </Link>
        </motion.div>
      )}

      {/* ── Swapped Recipes ── */}
      <AnimatePresence>
        {swappedRecipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">
              Đã đổi ({swappedRecipes.length})
            </h3>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {swappedRecipes.map((recipe) => (
                <motion.button
                  key={recipe.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => handleSwap(recipe.id)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-container border border-outline-variant hover:border-primary/30 transition-all cursor-pointer"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5 text-on-surface-variant" />
                  <span className="text-sm font-medium text-on-surface whitespace-nowrap">
                    {recipe.title}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {formatVND(recipe.totalPrice)}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Footer tip ── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-xs text-center text-on-surface-variant py-4"
      >
        💡 Nhấn vào thẻ món ăn để xem nguyên liệu & tối ưu hóa giá • Sử dụng{" "}
        <strong>Đổi nguyên liệu</strong> để ẩn món bạn không thích
      </motion.p>
    </div>
  );
}
