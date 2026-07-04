"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Recipe } from "@/data/mockData";
import RecipeCard from "./RecipeCard";

// ─────────────────────────────────────────────────────────────
// RecipeCarousel Component
// ─────────────────────────────────────────────────────────────

interface RecipeCarouselProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  recipes: Recipe[];
  variant?: "default" | "compact";
}

export default function RecipeCarousel({
  title,
  subtitle,
  icon,
  recipes,
  variant = "default",
}: RecipeCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll boundaries
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = variant === "compact" ? 276 : 316; // card width + gap
    el.scrollBy({
      left: direction === "left" ? -cardWidth * 2 : cardWidth * 2,
      behavior: "smooth",
    });
  }, [variant]);

  if (recipes.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      aria-label={title}
    >
      {/* ── Section Header ── */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-container/70 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-surface">{title}</h2>
            {subtitle && (
              <p className="text-xs text-on-surface-variant">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Scroll arrows (desktop) */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`
              p-2 rounded-xl border transition-all duration-200
              ${
                canScrollLeft
                  ? "border-outline-variant hover:bg-surface-container-high cursor-pointer text-on-surface"
                  : "border-transparent text-outline cursor-not-allowed"
              }
            `}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`
              p-2 rounded-xl border transition-all duration-200
              ${
                canScrollRight
                  ? "border-outline-variant hover:bg-surface-container-high cursor-pointer text-on-surface"
                  : "border-transparent text-outline cursor-not-allowed"
              }
            `}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Scrollable Container ── */}
      <div className="relative">
        {/* Left fade */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        )}

        {/* Right fade */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scroll-smooth scrollbar-hide"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {recipes.map((recipe, index) => (
            <div key={recipe.id} className="snap-start">
              <RecipeCard
                recipe={recipe}
                index={index}
                variant={variant}
              />
            </div>
          ))}

          {/* End spacer for last-card visibility */}
          <div className="flex-shrink-0 w-1" aria-hidden="true" />
        </div>
      </div>
    </motion.section>
  );
}
