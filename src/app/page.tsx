"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  CalendarDays,
  TrendingUp,
  Sun,
  Moon,
  Sunrise,
  Sunset,
} from "lucide-react";
import BudgetCard from "@/components/dashboard/BudgetCard";
import RecipeCarousel from "@/components/dashboard/RecipeCarousel";
import AIChatAssistant from "@/components/dashboard/AIChatAssistant";
import { recipes } from "@/data/mockData";

// ─────────────────────────────────────────────────────────────
// Time-of-day greeting
// ─────────────────────────────────────────────────────────────

function getGreeting(): {
  text: string;
  emoji: string;
  icon: React.ComponentType<{ className?: string }>;
} {
  const hour = new Date().getHours();
  if (hour < 6)
    return { text: "Chào ban đêm", emoji: "🌙", icon: Moon };
  if (hour < 12)
    return { text: "Chào buổi sáng", emoji: "☀️", icon: Sunrise };
  if (hour < 17)
    return { text: "Chào buổi chiều", emoji: "🌤️", icon: Sun };
  if (hour < 21)
    return { text: "Chào buổi tối", emoji: "🌅", icon: Sunset };
  return { text: "Chào ban đêm", emoji: "🌙", icon: Moon };
}

// ─────────────────────────────────────────────────────────────
// Dashboard Page
// ─────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // ── "Daily Meal Plan" — curated mix: breakfast-like, lunch, dinner ──
  const dailyMealPlan = useMemo(() => {
    // Pick a balanced selection: easy/quick for morning, medium for lunch, any for dinner
    const breakfast = recipes.find((r) =>
      r.tags.some((t) => ["breakfast", "dessert", "appetizer", "quick"].includes(t))
    );
    const lunch = recipes.find((r) =>
      r.tags.some((t) => ["rice", "sandwich", "street-food", "noodles"].includes(t))
    );
    const dinner = recipes.find((r) =>
      r.tags.some((t) => ["soup", "dinner", "braised"].includes(t))
    );
    const comfort = recipes.find((r) =>
      r.tags.some((t) => ["comfort", "grilled"].includes(t)) &&
      r.id !== breakfast?.id &&
      r.id !== lunch?.id &&
      r.id !== dinner?.id
    );

    // Build unique list maintaining order
    const plan: typeof recipes = [];
    const seen = new Set<string>();
    [breakfast, lunch, dinner, comfort].forEach((r) => {
      if (r && !seen.has(r.id)) {
        seen.add(r.id);
        plan.push(r);
      }
    });

    // Fill up to 5 if we have space
    for (const r of recipes) {
      if (plan.length >= 5) break;
      if (!seen.has(r.id)) {
        seen.add(r.id);
        plan.push(r);
      }
    }
    return plan;
  }, []);

  // ── "Trending Budget Recipes" — sorted cheapest first ──
  const trendingBudget = useMemo(
    () => [...recipes].sort((a, b) => a.totalPrice - b.totalPrice),
    []
  );

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* ═══════════════════════════════════════════════════════
          HERO — Greeting Header
          ═══════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden gradient-hero rounded-3xl p-6 sm:p-8"
      >
        {/* Decorative floating shapes */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 5, 0],
          }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-4 right-8 w-16 h-16 rounded-2xl bg-secondary/10 hidden sm:block"
        />
        <motion.div
          animate={{
            y: [0, 6, 0],
            rotate: [0, -3, 0],
          }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-4 right-24 w-10 h-10 rounded-xl bg-primary/10 hidden sm:block"
        />

        <div className="relative flex items-start gap-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 15, delay: 0.2 }}
            className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-lg"
          >
            <GreetingIcon className="w-7 h-7 text-white" />
          </motion.div>
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight"
            >
              {greeting.text}, bạn ơi! {greeting.emoji}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="text-on-surface-variant mt-1 text-sm sm:text-base"
            >
              Chào bạn, ngân sách đi chợ hôm nay của bạn là bao nhiêu? Hãy để AI tìm bữa ăn hoàn hảo cho bạn.
            </motion.p>

            {/* Animated tag line */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 mt-3"
            >
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/80 backdrop-blur-sm border border-outline-variant/50 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span className="text-xs font-semibold text-on-surface-variant">
                  Lên kế hoạch đi chợ bằng AI
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface/80 backdrop-blur-sm border border-outline-variant/50 shadow-sm">
                <span className="text-xs font-semibold text-on-surface-variant">
                  🏪 So sánh giá 3 siêu thị
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* ═══════════════════════════════════════════════════════
          BUDGET INPUT CARD
          ═══════════════════════════════════════════════════════ */}
      <BudgetCard />

      {/* ═══════════════════════════════════════════════════════
          DAILY MEAL PLAN — Horizontal Scroll
          ═══════════════════════════════════════════════════════ */}
      <RecipeCarousel
        title="Thực đơn mỗi ngày"
        subtitle="Lựa chọn cân bằng dinh dưỡng cho ngày hôm nay"
        icon={<CalendarDays className="w-4 h-4 text-primary" />}
        recipes={dailyMealPlan}
      />

      {/* ═══════════════════════════════════════════════════════
          TRENDING BUDGET RECIPES — Horizontal Scroll
          ═══════════════════════════════════════════════════════ */}
      <RecipeCarousel
        title="Công thức tiết kiệm đang hot"
        subtitle="Ưu tiên các món ăn hợp túi tiền nhất"
        icon={<TrendingUp className="w-4 h-4 text-secondary" />}
        recipes={trendingBudget}
        variant="compact"
      />

      <AIChatAssistant />
    </div>
  );
}
