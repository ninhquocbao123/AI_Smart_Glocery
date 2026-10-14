"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays,
  Sparkles,
  Wallet,
  ArrowLeft,
  Plus,
  CheckCircle2,
  Trash2,
  ListPlus,
  Sun,
  Sunset,
  Moon,
} from "lucide-react";
import { useAppContext, type CartItem } from "@/context/AppContext";
import { useCatalogRecipes } from "@/lib/use-catalog-recipes";
import { formatVND } from "@/lib/priceUtils";
import RecipeImage from "@/components/ui/RecipeImage";

import { useRouter } from "next/navigation";
import { Lock, Crown } from "lucide-react";

const DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const MEAL_TYPES = [
  { id: "breakfast", label: "Sáng", icon: Sun },
  { id: "lunch", label: "Trưa", icon: Sunset },
  { id: "dinner", label: "Tối", icon: Moon },
] as const;

export default function WeeklyMealPlanPage() {
  const recipes = useCatalogRecipes();
  const { state, setWeeklyPlanMeal, addMultipleToCart } = useAppContext();
  const [activeDay, setActiveDay] = useState("T4");
  const [showPremium, setShowPremium] = useState(true);
  const router = useRouter();

  const weeklyPlan = state.weeklyPlan;

  const budget = state.userBudget > 0 ? state.userBudget * 7 : 7000000;
  const saved = 250000;

  // Calculate today's total
  const todayMeals = weeklyPlan[activeDay] || {};
  const todayTotal = Object.values(todayMeals).reduce((sum, recipe) => {
    return sum + (recipe?.totalPrice || 0);
  }, 0);

  const handleRandomSuggest = () => {
    MEAL_TYPES.forEach(({ id }) => {
      if (!todayMeals[id]) {
        const randomRecipe = recipes[(DAYS.indexOf(activeDay) + MEAL_TYPES.findIndex(m=>m.id===id)) % recipes.length];
        setWeeklyPlanMeal(activeDay, id, randomRecipe);
      }
    });
  };

  const handleAddRandomMeal = (mealType: "breakfast" | "lunch" | "dinner") => {
    const randomRecipe = recipes[(recipes.findIndex(r=>r.id===todayMeals[mealType]?.id)+1) % recipes.length];
    setWeeklyPlanMeal(activeDay, mealType, randomRecipe);
  };

  const handleUpdateCart = () => {
    const allCartItems: CartItem[] = [];
    
    // Gather all ingredients from the entire weekly plan
    Object.values(weeklyPlan).forEach((dayMeals) => {
      Object.values(dayMeals).forEach((recipe) => {
        if (recipe) {
          recipe.ingredients.forEach((ing) => {
            allCartItems.push({
              ingredient: ing,
              recipeId: recipe.id,
              recipeTitle: recipe.title,
              quantity: ing.quantity,
            });
          });
        }
      });
    });

    if (allCartItems.length > 0) {
      addMultipleToCart(allCartItems);
    }
    router.push("/grocery-store");
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <Link
          href="/meal-plan"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Gợi ý món ăn
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center shadow-md">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-on-surface tracking-tight">
                Lên lịch bữa ăn AI
              </h1>
              <p className="text-sm text-on-surface-variant">
                Tiết kiệm thời gian và tiền bạc với kế hoạch ăn uống thông minh.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-2xl bg-surface border border-outline-variant shadow-sm">
            <Wallet className="w-8 h-8 text-primary bg-primary/10 p-1.5 rounded-xl" />
            <div>
              <div className="text-xs text-on-surface-variant font-medium">Ngân sách tuần này:</div>
              <div className="text-sm font-bold text-on-surface">{formatVND(budget)}</div>
              <div className="text-[10px] text-secondary font-semibold mt-0.5">
                Tiết kiệm được {formatVND(saved)} so với tuần trước
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid with Premium Overlay if active */}
      <div className="relative">
        {showPremium && (
          <div className="absolute inset-0 z-50 rounded-3xl bg-surface/50 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="max-w-md w-full bg-surface border-2 border-[#FFD700]/30 rounded-3xl shadow-2xl p-8 text-center relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#FFD700] via-[#FFA500] to-[#FFD700]" />
              <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-[#FFD700]/20 to-[#FFA500]/20 rounded-full flex items-center justify-center mb-6">
                <Crown className="w-10 h-10 text-[#FFA500]" />
              </div>
              <h2 className="text-2xl font-extrabold text-on-surface mb-3">Tính năng Premium</h2>
              <p className="text-sm text-on-surface-variant mb-6">
                Lên thực đơn tự động cho cả tuần, tối ưu hóa ngân sách và gợi ý tận dụng nguyên liệu thừa.
              </p>
              
              <div className="bg-surface-container rounded-2xl p-5 mb-8 text-left space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFA500] flex-shrink-0" />
                  <span className="text-sm font-medium">Lên thực đơn 7 ngày/tuần</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFA500] flex-shrink-0" />
                  <span className="text-sm font-medium">Theo dõi kho nguyên liệu (Pantry)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#FFA500] flex-shrink-0" />
                  <span className="text-sm font-medium">Tự động phân bổ ngân sách tối ưu</span>
                </div>
              </div>

              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-white font-extrabold text-lg shadow-lg hover:shadow-xl transition-all mb-4">
                Nâng cấp chỉ 19.000đ/tháng
              </button>
              <button 
                onClick={() => setShowPremium(false)}
                className="text-xs text-on-surface-variant hover:text-on-surface underline font-medium"
              >
                Trải nghiệm thử
              </button>
            </motion.div>
          </div>
        )}
        
        <div className={`grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 ${showPremium ? 'pointer-events-none' : ''}`}>
        
        {/* Left: Weekly Calendar & Day Plan */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-surface rounded-3xl border border-outline-variant shadow-sm p-6"
        >
          {/* Day Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 border-b border-outline-variant scrollbar-hide">
            {DAYS.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`
                  flex-1 min-w-[64px] flex flex-col items-center justify-center py-3 rounded-2xl transition-all cursor-pointer
                  ${
                    activeDay === day
                      ? "bg-primary text-on-primary shadow-md"
                      : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                  }
                `}
              >
                <span className={`text-xs ${activeDay === day ? "opacity-90" : ""}`}>Thứ</span>
                <span className="text-lg font-bold mt-0.5">{day === "CN" ? "CN" : day.replace("T", "")}</span>
              </button>
            ))}
          </div>

          {/* Meals for selected day */}
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-on-surface">Thực đơn {activeDay === "CN" ? "Chủ nhật" : `Thứ ${activeDay.replace("T", "")}`}</h2>
              <button 
                onClick={handleRandomSuggest}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Gợi ý ngẫu nhiên
              </button>
            </div>

            {MEAL_TYPES.map(({ id, label, icon: Icon }) => {
              const recipe = weeklyPlan[activeDay]?.[id];

              return (
                <div key={id} className="flex gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-primary z-10 shadow-sm border-4 border-surface">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="w-0.5 h-full bg-outline-variant/50 -my-2" />
                  </div>

                  {/* Meal content */}
                  <div className="flex-1 pb-6">
                    <h3 className="text-sm font-bold text-on-surface-variant mb-3">{label}</h3>
                    
                    {recipe ? (
                      <div className="flex items-start gap-4 p-3 rounded-2xl border border-outline-variant hover:border-primary/50 transition-colors group bg-surface">
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
                          <RecipeImage recipeId={recipe.id} src={recipe.image} alt={recipe.title} variant="card" />
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <h4 className="text-sm font-bold text-on-surface line-clamp-1">{recipe.title}</h4>
                          <div className="flex items-center gap-2 mt-1 mb-2 text-xs text-on-surface-variant">
                            <span className="font-semibold text-primary">{formatVND(recipe.totalPrice)}</span>
                            <span>•</span>
                            <span>{recipe.prepTime + recipe.cookTime} phút</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => setWeeklyPlanMeal(activeDay, id, undefined)}
                              className="text-xs font-semibold text-error hover:bg-error/10 px-2 py-1 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" /> Xóa
                            </button>
                          </div>
                        </div>
                        <button className="w-10 h-10 rounded-xl bg-primary text-on-primary flex items-center justify-center flex-shrink-0 self-center hover:bg-primary-dark transition-colors shadow-sm cursor-pointer">
                          <ListPlus className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleAddRandomMeal(id)}
                        className="w-full flex flex-col items-center justify-center py-6 border-2 border-dashed border-outline-variant rounded-2xl text-on-surface-variant hover:bg-surface-container hover:border-primary/50 hover:text-primary transition-all cursor-pointer"
                      >
                        <Plus className="w-6 h-6 mb-2" />
                        <span className="text-sm font-semibold">Thêm món {label.toLowerCase()}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Right: Pantry & Summary */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Pantry */}
          <div className="bg-surface rounded-3xl border border-outline-variant shadow-sm p-6">
            <h3 className="text-sm font-bold text-on-surface mb-4">Nguồn dự trữ nhà bạn</h3>
            <div className="space-y-3">
              {state.pantryIngredients.length > 0 ? (
                state.pantryIngredients.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    <span className="text-sm text-on-surface font-medium">{item}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-on-surface-variant italic">Không có nguyên liệu dự trữ.</p>
              )}
            </div>
            <button className="w-full mt-5 py-2.5 rounded-xl border border-outline-variant text-sm font-semibold text-primary hover:bg-primary/5 transition-colors cursor-pointer">
              Thêm nguyên liệu
            </button>
          </div>

          {/* Summary Box */}
          <div className="bg-primary-container/20 rounded-3xl border border-primary/20 p-6">
            <h3 className="text-sm font-bold text-on-surface mb-2">Tổng kết {activeDay}</h3>
            <div className="text-3xl font-black text-primary mb-4">
              {formatVND(todayTotal)} <span className="text-sm font-semibold text-on-surface-variant">/ ngày</span>
            </div>
            <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
              Thực đơn hôm nay rất cân bằng. Có thể tận dụng {state.pantryIngredients[0] || 'nước tương'} sẵn có ở nhà để nấu bữa tối!
            </p>
            <button 
              onClick={handleUpdateCart}
              className="w-full py-3.5 rounded-2xl gradient-primary text-on-primary font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              Cập nhật giỏ hàng
            </button>
          </div>
        </motion.div>
      </div>
    </div>
    </div>
  );
}
