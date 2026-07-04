"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Flame,
  Store,
  ChefHat,
} from "lucide-react";
import type { Recipe } from "@/data/mockData";
import RecipeImage from "@/components/ui/RecipeImage";

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

const difficultyConfig = {
  "Dễ": { color: "bg-primary-container text-on-primary-container", dots: 1 },
  "Trung bình": { color: "bg-secondary-container text-on-secondary-container", dots: 2 },
  "Khó": { color: "bg-error-container text-on-error-container", dots: 3 },
} as const;

// Map cuisine emojis for visual variety
const cuisineEmoji: Record<string, string> = {
  "Việt Nam": "🇻🇳",
};

// Store badge colors
const storeColors: Record<string, string> = {
  "Bach Hoa Xanh": "bg-[#4CAF50]/10 text-[#2E7D32]",
  Winmart: "bg-[#FF6F00]/10 text-[#E65100]",
  "Coop Food": "bg-[#1565C0]/10 text-[#0D47A1]",
};

// ─────────────────────────────────────────────────────────────
// RecipeCard Component
// ─────────────────────────────────────────────────────────────

interface RecipeCardProps {
  recipe: Recipe;
  index: number;
  variant?: "default" | "compact";
}

export default function RecipeCard({
  recipe,
  index,
  variant = "default",
}: RecipeCardProps) {
  const difficulty = difficultyConfig[recipe.difficulty];
  const emoji = cuisineEmoji[recipe.cuisine] ?? "🍽️";

  // Collect unique stores used in the recipe
  const uniqueStores = [...new Set(recipe.ingredients.map((i) => i.store))];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        group relative flex-shrink-0 overflow-hidden rounded-2xl
        bg-surface border border-outline-variant
        cursor-pointer select-none
        transition-shadow duration-300 hover:shadow-[var(--shadow-elevation-3)]
        ${variant === "compact" ? "w-[260px]" : "w-[300px]"}
      `}
      role="article"
      aria-label={`Recipe: ${recipe.title}`}
    >
      {/* ── Recipe Image ── */}
      <div className="relative h-40 overflow-hidden">
        <RecipeImage
          recipeId={recipe.id}
          src={recipe.image}
          alt={recipe.title}
          variant="card"
          className="h-40 w-full"
        />

        {/* Cuisine icon */}
        <div className="absolute top-3 left-3">
          <div className="p-1.5 rounded-xl bg-surface/90 backdrop-blur-sm shadow-sm">
            <ChefHat className="w-4 h-4 text-on-surface-variant" />
          </div>
        </div>

        {/* Price badge */}
        <div className="absolute top-3 right-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.08 + 0.3, type: "spring" }}
            className="px-3 py-1.5 rounded-xl bg-surface/90 backdrop-blur-sm shadow-sm"
          >
            <span className="text-sm font-bold text-primary">
              {formatVND(recipe.totalPrice)}
            </span>
          </motion.div>
        </div>

        {/* Difficulty badge */}
        <div className="absolute bottom-3 left-3">
          <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${difficulty.color}`}>
            {recipe.difficulty}
          </div>
        </div>

        {/* Gradient overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-surface/80 to-transparent" />
      </div>

      {/* ── Card Content ── */}
      <div className="p-4">
        {/* Title */}
        <h3 className="text-base font-bold text-on-surface leading-tight mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {recipe.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-on-surface-variant leading-relaxed mb-3 line-clamp-2">
          {recipe.description}
        </p>

        {/* Meta row: prep time, servings */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1 text-on-surface-variant">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {recipe.prepTime + recipe.cookTime} phút
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
            <Users className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">
              {recipe.servings} phần ăn
            </span>
          </div>
          <div className="flex items-center gap-1 text-on-surface-variant">
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
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${storeColors[store] ?? "bg-surface-container text-on-surface-variant"}`}
            >
              {store}
            </span>
          ))}
        </div>
      </div>

      {/* Hover overlay glow */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-primary/[0.03] to-transparent" />
    </motion.article>
  );
}
