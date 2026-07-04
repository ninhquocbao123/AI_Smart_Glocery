"use client";

import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ShoppingBasket,
  Clock,
  Users,
  Flame,
  ChefHat,
  Star,
  ShoppingCart,
  Sparkles,
  TrendingDown,
  Store,
  Package,
  ArrowRight,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { recipes, type Ingredient, type Store as StoreType } from "@/data/mockData";
import { formatVND, getPriceAtStore, getTotalAtStore } from "@/lib/priceUtils";
import RecipeImage from "@/components/ui/RecipeImage";

// ─────────────────────────────────────────────────────────────
// Store config
// ─────────────────────────────────────────────────────────────

const storeConfig: Record<
  StoreType,
  { color: string; bg: string; border: string; icon: string }
> = {
  "Bach Hoa Xanh": {
    color: "text-[#2E7D32]",
    bg: "bg-[#4CAF50]/8",
    border: "border-[#4CAF50]/20",
    icon: "🟢",
  },
  Winmart: {
    color: "text-[#E65100]",
    bg: "bg-[#FF6F00]/8",
    border: "border-[#FF6F00]/20",
    icon: "🟠",
  },
  "Coop Food": {
    color: "text-[#0D47A1]",
    bg: "bg-[#1565C0]/8",
    border: "border-[#1565C0]/20",
    icon: "🔵",
  },
};

const allStores: StoreType[] = ["Bach Hoa Xanh", "Winmart", "Coop Food"];

// ─────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { state, isInPantry, addToCart } = useAppContext();

  const recipeId = params.id as string;
  const recipe = recipes.find((r) => r.id === recipeId);

  const [selectedStore, setSelectedStore] = useState<StoreType | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // ── Categorize ingredients ──
  const { inPantry, needToBuy } = useMemo(() => {
    if (!recipe) return { inPantry: [] as Ingredient[], needToBuy: [] as Ingredient[] };
    const ip: Ingredient[] = [];
    const ntb: Ingredient[] = [];
    for (const ing of recipe.ingredients) {
      if (isInPantry(ing.name)) {
        ip.push(ing);
      } else {
        ntb.push(ing);
      }
    }
    return { inPantry: ip, needToBuy: ntb };
  }, [recipe, isInPantry]);

  // ── Price comparison across stores ──
  const storePrices = useMemo(() => {
    return allStores.map((store) => ({
      store,
      total: getTotalAtStore(needToBuy, store),
      items: needToBuy.map((ing) => ({
        ingredient: ing,
        price: getPriceAtStore(ing, store),
      })),
    }));
  }, [needToBuy]);

  const bestStore = useMemo(() => {
    if (storePrices.length === 0) return null;
    return storePrices.reduce((best, curr) =>
      curr.total < best.total ? curr : best
    );
  }, [storePrices]);

  // Currently displayed store data
  const activeStoreData = useMemo(() => {
    if (!selectedStore) return null;
    return storePrices.find((s) => s.store === selectedStore) ?? null;
  }, [selectedStore, storePrices]);

  // Automatically select the cheapest store on mount/calculation
  useEffect(() => {
    if (bestStore && !selectedStore) {
      setSelectedStore(bestStore.store);
    }
  }, [bestStore, selectedStore]);

  // ── Add missing to cart ──
  const handleAddToCart = useCallback(() => {
    if (!recipe || !selectedStore || needToBuy.length === 0) return;
    setIsAdding(true);

    // Simulate a brief delay for UX polish
    setTimeout(() => {
      for (const ing of needToBuy) {
        const storePriceTotal = getPriceAtStore(ing, selectedStore);
        const unitPrice = Math.round(storePriceTotal / ing.quantity);
        addToCart({
          ingredient: {
            ...ing,
            price: unitPrice,
            store: selectedStore,
          },
          recipeId: recipe.id,
          recipeTitle: recipe.title,
          quantity: ing.quantity,
        });
      }
      setIsAdding(false);
      setAddedSuccess(true);

      // Navigate to grocery store after short success state
      setTimeout(() => {
        router.push("/grocery-store");
      }, 800);
    }, 500);
  }, [recipe, needToBuy, selectedStore, addToCart, router]);

  // ── 404 ──
  if (!recipe) {
    return (
      <div className="space-y-6">
        <Link
          href="/meal-plan"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách gợi ý
        </Link>
        <div className="card-outlined p-12 text-center">
          <ChefHat className="w-16 h-16 text-on-surface-variant mx-auto mb-4 opacity-30" />
          <h2 className="text-lg font-bold text-on-surface mb-2">
            Không tìm thấy công thức nấu ăn
          </h2>
          <p className="text-sm text-on-surface-variant">
            Công thức nấu ăn bạn tìm kiếm không tồn tại.
          </p>
        </div>
      </div>
    );
  }

  const cuisineEmoji =
    recipe.cuisine === "Vietnamese-French" ? "🇫🇷" : "🇻🇳";
  const savingsVsBest = bestStore
    ? Math.max(
        ...storePrices.map((s) => s.total)
      ) - bestStore.total
    : 0;

  return (
    <div className="space-y-6 pb-28">
      {/* ── Back ── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link
          href="/meal-plan"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại danh sách gợi ý
        </Link>
      </motion.div>

      {/* ═══════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl"
      >
        {/* Hero image */}
        <div className="relative">
          <RecipeImage
            recipeId={recipe.id}
            src={recipe.image}
            alt={recipe.title}
            variant="hero"
          />

          {/* Difficulty + Price overlay */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-sm ${
                { "Dễ": "bg-primary/90 text-on-primary", "Trung bình": "bg-secondary/90 text-on-secondary", "Khó": "bg-error/80 text-on-error" }[recipe.difficulty]
              }`}
            >
              {recipe.difficulty}
            </span>
          </div>
          <div className="absolute top-4 right-4 z-10">
            <div className="px-4 py-2 rounded-xl bg-surface/90 backdrop-blur-sm shadow-sm">
              <span className="text-lg font-bold text-primary">
                {formatVND(recipe.totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Recipe info bar */}
        <div className="px-6 pb-6 -mt-4 relative">
          <div className="bg-surface rounded-2xl p-5 shadow-[var(--shadow-elevation-2)]">
            <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface tracking-tight mb-2">
              {recipe.title}
            </h1>
            <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
              {recipe.description}
            </p>

            {/* Meta chips */}
            <div className="flex flex-wrap items-center gap-3 text-on-surface-variant">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {recipe.prepTime} phút chuẩn bị · {recipe.cookTime} phút nấu
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {recipe.servings} phần ăn
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {recipe.ingredients.length} nguyên liệu
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          SMART INGREDIENT LIST
          ═══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-container/70 flex items-center justify-center">
            <Package className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-surface">
              Danh sách nguyên liệu thông minh
            </h2>
            <p className="text-xs text-on-surface-variant">
              {inPantry.length} có sẵn trong tủ lạnh · {needToBuy.length} cần mua
            </p>
          </div>
        </div>

        {/* ── In Pantry (green) ── */}
        {inPantry.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Đã có sẵn trong tủ lạnh
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {inPantry.map((ing, i) => (
                <motion.div
                  key={ing.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-container/30 border border-primary-container/50"
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface border border-outline-variant">
                      {ing.image ? (
                        <img src={ing.image} alt={ing.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-sm">🥦</div>
                      )}
                    </div>
                    <CheckCircle2 className="w-4 h-4 text-primary absolute -bottom-1 -right-1 bg-surface rounded-full shadow-sm" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-on-surface">
                      {ing.name}
                    </span>
                    <span className="text-xs text-on-surface-variant ml-2">
                      {ing.quantity} {ing.unit}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-primary">
                    Có sẵn!
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ── Need to Buy ── */}
        {needToBuy.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBasket className="w-3.5 h-3.5" />
              Cần mua ({needToBuy.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {needToBuy.map((ing, i) => {
                const price =
                  activeStoreData
                    ? activeStoreData.items.find(
                        (item) => item.ingredient.id === ing.id
                      )?.price ?? ing.price * ing.quantity
                    : ing.price * ing.quantity;
                const sc = storeConfig[ing.store];
                return (
                  <motion.div
                    key={ing.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 + 0.1 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-secondary-container/20 border border-secondary-container/40"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface border border-outline-variant">
                        {ing.image ? (
                          <img src={ing.image} alt={ing.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-secondary/10 flex items-center justify-center text-sm">🛒</div>
                        )}
                      </div>
                      <ShoppingBasket className="w-4 h-4 text-secondary absolute -bottom-1 -right-1 bg-surface rounded-full shadow-sm" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-on-surface truncate">
                          {ing.name}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${sc.bg} ${sc.color}`}
                        >
                          {ing.store}
                        </span>
                      </div>
                      <span className="text-xs text-on-surface-variant">
                        {ing.quantity} {ing.unit}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-on-surface whitespace-nowrap">
                      {formatVND(price)}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          PRICE OPTIMIZER
          ═══════════════════════════════════════════════════════ */}
      {needToBuy.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary-container/70 flex items-center justify-center">
              <TrendingDown className="w-4 h-4 text-secondary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">
                Tối ưu hóa giá cả
              </h2>
              <p className="text-xs text-on-surface-variant">
                So sánh giá giữa các siêu thị cho nguyên liệu còn thiếu
              </p>
            </div>
          </div>

          {/* Store tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {storePrices.map(({ store, total }) => {
              const sc = storeConfig[store];
              const isCheapest = bestStore?.store === store;
              const isActive = selectedStore === store;

              return (
                <button
                  key={store}
                  onClick={() => setSelectedStore(store)}
                  className={`
                    flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                    transition-all duration-200 cursor-pointer border
                    ${
                      isActive
                        ? `${sc.bg} ${sc.color} ${sc.border} shadow-md`
                        : "bg-surface-container text-on-surface-variant border-outline-variant hover:bg-surface-container-high"
                    }
                  `}
                >
                  <span>{sc.icon}</span>
                  <span className="whitespace-nowrap">{store}</span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      isCheapest
                        ? "bg-primary/10 text-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {formatVND(total)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Price comparison cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {storePrices.map(({ store, total }) => {
              const sc = storeConfig[store];
              const isCheapest = bestStore?.store === store;
              const isActive = selectedStore === store;
              const diff = bestStore ? total - bestStore.total : 0;

              return (
                <motion.div
                  key={store}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedStore(store)}
                  className={`
                    relative p-4 rounded-2xl cursor-pointer transition-all duration-200
                    border-2
                    ${
                      isActive
                        ? `${sc.bg} ${sc.border} shadow-md`
                        : "bg-surface border-outline-variant hover:border-outline"
                    }
                  `}
                >
                  {isCheapest && (
                    <div className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                      RẺ NHẤT
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{sc.icon}</span>
                    <span className={`text-sm font-bold ${sc.color}`}>
                      {store}
                    </span>
                  </div>
                  <p className="text-xl font-extrabold text-on-surface">
                    {formatVND(total)}
                  </p>
                  {diff > 0 && (
                    <p className="text-xs text-error font-medium mt-1">
                      +{formatVND(diff)} chênh lệch
                    </p>
                  )}
                  {isCheapest && diff === 0 && (
                    <p className="text-xs text-primary font-medium mt-1">
                      Bạn tiết kiệm {formatVND(savingsVsBest)}!
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      )}

      {/* ═══════════════════════════════════════════════════════
          COOKING INSTRUCTIONS
          ═══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-tertiary-container/70 flex items-center justify-center">
            <ChefHat className="w-4 h-4 text-tertiary" />
          </div>
          <h2 className="text-lg font-bold text-on-surface">
            Các bước thực hiện
          </h2>
        </div>

        <div className="space-y-3">
          {recipe.instructions.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 + i * 0.06 }}
              className="flex gap-4 items-start"
            >
              <div className="w-8 h-8 rounded-full bg-tertiary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-sm font-bold text-tertiary">
                  {i + 1}
                </span>
              </div>
              <p className="text-sm text-on-surface leading-relaxed pt-1">
                {step}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          STICKY BOTTOM BAR
          ═══════════════════════════════════════════════════════ */}
      {needToBuy.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:left-[260px] z-40 mb-16 md:mb-0">
          <div className="bg-surface/95 backdrop-blur-xl border-t border-outline-variant px-4 sm:px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
              {/* Summary */}
              <div className="min-w-0">
                <p className="text-sm font-bold text-on-surface truncate">
                  {needToBuy.length} nguyên liệu cần mua
                </p>
                <p className="text-xs text-on-surface-variant">
                  Tổng cộng:{" "}
                  <span className="font-semibold text-primary">
                    {formatVND(activeStoreData?.total ?? 0)}
                  </span>
                  {bestStore && selectedStore === bestStore.store && (
                    <span className="ml-1 text-primary">
                      tại {bestStore.store}
                    </span>
                  )}
                </p>
              </div>

              {/* Add to Cart button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAddToCart}
                disabled={isAdding || addedSuccess}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-2xl
                  text-sm font-bold whitespace-nowrap
                  transition-all duration-300 cursor-pointer
                  ${
                    addedSuccess
                      ? "bg-primary text-on-primary"
                      : isAdding
                      ? "bg-surface-container-high text-outline cursor-wait"
                      : "gradient-primary text-on-primary shadow-lg hover:shadow-xl"
                  }
                `}
              >
                <AnimatePresence mode="wait">
                  {addedSuccess ? (
                    <motion.span
                      key="success"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Đã thêm! Đang chuyển hướng…
                    </motion.span>
                  ) : isAdding ? (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      >
                        <Sparkles className="w-4 h-4" />
                      </motion.div>
                      Đang thêm…
                    </motion.span>
                  ) : (
                    <motion.span
                      key="default"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Thêm vào giỏ hàng
                      <ArrowRight className="w-4 h-4" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
