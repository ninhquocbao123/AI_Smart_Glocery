"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wallet,
  ArrowRight,
  Sparkles,
  TrendingUp,
  CircleDollarSign,
  Users,
} from "lucide-react";
import { useAppContext } from "@/context/AppContext";

// ─────────────────────────────────────────────────────────────
// VND Format Helpers
// ─────────────────────────────────────────────────────────────

function formatVNDDisplay(value: number): string {
  if (value === 0) return "";
  return new Intl.NumberFormat("vi-VN").format(value);
}

function parseVNDInput(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

// ─────────────────────────────────────────────────────────────
// Quick budget presets
// ─────────────────────────────────────────────────────────────

const budgetPresets = [
  { label: "50K", value: 50000 },
  { label: "100K", value: 100000 },
  { label: "150K", value: 150000 },
  { label: "200K", value: 200000 },
];

// ─────────────────────────────────────────────────────────────
// BudgetCard Component
// ─────────────────────────────────────────────────────────────

export default function BudgetCard() {
  const router = useRouter();
  const { setBudget, setServings, state } = useAppContext();
  const [inputValue, setInputValue] = useState<number>(state.userBudget);
  const [servingsValue, setServingsValue] = useState<number>(state.servings);
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsed = parseVNDInput(e.target.value);
      // Cap at 100 billion to avoid absurd values
      if (parsed <= 100_000_000_000) {
        setInputValue(parsed);
      }
    },
    []
  );

  const handlePresetClick = useCallback((value: number) => {
    setInputValue(value);
    inputRef.current?.focus();
  }, []);

  const handlePlanMeals = useCallback(() => {
    if (inputValue <= 0) {
      inputRef.current?.focus();
      return;
    }

    setIsSubmitting(true);
    setBudget(inputValue);
    setServings(servingsValue);

    // Small delay for the animation before navigating
    setTimeout(() => {
      router.push("/ai-suggestions");
    }, 600);
  }, [inputValue, servingsValue, setBudget, setServings, router]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handlePlanMeals();
      }
    },
    [handlePlanMeals]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-surface rounded-[32px] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline-variant/30 text-center relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.02] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />

        <h2 className="text-3xl md:text-5xl font-extrabold text-primary tracking-tight mb-4 leading-tight">
          Ăn gì với 50k?<br/>
          <span className="text-2xl md:text-4xl text-on-surface">Gợi ý món ngon, tính tiền, lên danh sách đi chợ.</span>
        </h2>
        <p className="text-on-surface-variant text-base md:text-lg mb-8 max-w-lg mx-auto">
          Lựa chọn số người ăn và ngân sách của bạn hôm nay.
        </p>

        {/* Servings Selector */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <span className="text-sm font-medium text-on-surface-variant flex items-center gap-2">
            <Users className="w-4 h-4" /> Số người ăn:
          </span>
          <div className="flex items-center bg-surface-container border border-outline-variant/50 rounded-full p-1">
            <button
              onClick={() => setServingsValue((prev) => Math.max(1, prev - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface"
            >
              -
            </button>
            <input
              type="number"
              min="1"
              max="20"
              aria-label="Số người ăn"
              value={servingsValue}
              onChange={(e) => setServingsValue(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-12 text-center bg-transparent outline-none font-bold text-on-surface appearance-none"
            />
            <button
              onClick={() => setServingsValue((prev) => Math.min(20, prev + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto mb-6">
          {/* Input field */}
          <div className="relative flex items-center bg-surface-container/30 border border-outline-variant/50 rounded-full px-6 py-4 w-full transition-all focus-within:border-primary focus-within:bg-surface focus-within:ring-4 focus-within:ring-primary/10">
            <span className="text-on-surface-variant font-medium mr-2">₫</span>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              value={isFocused ? (inputValue === 0 ? "" : inputValue.toString()) : formatVNDDisplay(inputValue)}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="flex-1 bg-transparent outline-none text-2xl font-bold text-on-surface text-center placeholder:text-outline"
              placeholder="50,000"
            />
            <span className="text-on-surface-variant font-medium ml-2">VND</span>
          </div>

          {/* Search/Submit Button */}
          <button
            onClick={handlePlanMeals}
            disabled={inputValue <= 0 || isSubmitting}
            className={`
              w-full sm:w-auto px-8 py-4 rounded-full font-bold text-base whitespace-nowrap
              transition-all shadow-md
              ${
                inputValue > 0 && !isSubmitting
                  ? "bg-secondary text-on-secondary hover:shadow-lg hover:-translate-y-0.5"
                  : "bg-surface-container-high text-outline cursor-not-allowed"
              }
            `}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                Đang xử lý
              </span>
            ) : (
              "Tìm thực đơn"
            )}
          </button>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="text-sm font-medium text-on-surface-variant mr-1">
            Gợi ý nhanh:
          </span>
          {budgetPresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset.value)}
              className="px-4 py-2 rounded-xl text-sm font-bold bg-surface-container hover:bg-primary/10 hover:text-primary transition-colors border border-outline-variant/50 text-on-surface"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
