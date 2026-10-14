"use client";

import React, { useState } from "react";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────
// Per-recipe gradient fallbacks (deterministic by recipe id)
// ─────────────────────────────────────────────────────────────

const fallbackGradients: Record<string, string> = {
  "recipe-001": "from-red-900/60 via-orange-800/40 to-yellow-900/30",
  "recipe-002": "from-amber-800/60 via-orange-700/40 to-red-900/30",
  "recipe-003": "from-orange-800/60 via-amber-700/40 to-yellow-900/30",
  "recipe-004": "from-emerald-800/60 via-teal-700/40 to-cyan-900/30",
  "recipe-005": "from-amber-700/60 via-yellow-600/40 to-orange-800/30",
  "recipe-006": "from-yellow-900/60 via-amber-800/40 to-orange-950/30",
  "recipe-007": "from-amber-900/60 via-orange-800/40 to-red-900/30",
  "recipe-008": "from-teal-800/60 via-emerald-700/40 to-cyan-900/30",
  "recipe-009": "from-yellow-800/60 via-amber-700/40 to-orange-900/30",
  "recipe-010": "from-green-800/60 via-emerald-700/40 to-teal-900/30",
};

const fallbackEmojis: Record<string, string> = {
  "recipe-011": "🍅", "recipe-012": "🍳", "recipe-013": "🥣",
  "recipe-014": "🥬", "recipe-015": "🍲", "recipe-016": "🥚",
  "recipe-001": "🍜",
  "recipe-002": "🍛",
  "recipe-003": "🥢",
  "recipe-004": "🌯",
  "recipe-005": "🥖",
  "recipe-006": "🍲",
  "recipe-007": "🥩",
  "recipe-008": "🐟",
  "recipe-009": "🍚",
  "recipe-010": "🥬",
};

// ─────────────────────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────────────────────

interface RecipeImageProps {
  /** The recipe id (e.g. "recipe-001") used to pick the right fallback */
  recipeId: string;
  /** The image src from mockData — can be "" for recipes with no generated image */
  src: string;
  /** Alt text */
  alt: string;
  /** Extra className for the wrapper div */
  className?: string;
  /** One of: "hero" (tall), "card" (medium), default "card" */
  variant?: "hero" | "card";
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function RecipeImage({
  recipeId,
  src,
  alt,
  className = "",
  variant = "card",
}: RecipeImageProps) {
  const [imgError, setImgError] = useState(false);

  const hasRealImage = src && src.trim() !== "" && !imgError;
  const gradient = fallbackGradients[recipeId] ?? "from-primary-container/60 via-surface-container to-secondary-container/30";
  const emoji = fallbackEmojis[recipeId] ?? "🇻🇳";

  const hasCustomHeight = className.split(" ").some(c => c.startsWith("h-") || c.startsWith("aspect-"));
  const heightClass = hasCustomHeight ? "" : (variant === "hero" ? "h-48 sm:h-56" : "h-44");

  return (
    <div className={`relative overflow-hidden ${heightClass} ${className}`}>
      {hasRealImage ? (
        <>
          {/* Real photo */}
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            priority={variant === "hero"}
          />
          {/* Subtle overlay so text on top stays readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
        </>
      ) : (
        /* Gradient fallback */
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <span
            className={`
              select-none transition-all duration-500 group-hover:scale-110 group-hover:opacity-40
              ${variant === "hero" ? "text-9xl opacity-20" : "text-7xl opacity-25"}
            `}
          >
            {emoji}
          </span>
        </div>
      )}
    </div>
  );
}
