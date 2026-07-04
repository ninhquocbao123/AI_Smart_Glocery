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
  { label: "200K", value: 200000 },
  { label: "300K", value: 300000 },
  { label: "500K", value: 500000 },
  { label: "1M", value: 1000000 },
];

// ─────────────────────────────────────────────────────────────
// BudgetCard Component
// ─────────────────────────────────────────────────────────────

export default function BudgetCard() {
  const router = useRouter();
  const { setBudget, state } = useAppContext();
  const [inputValue, setInputValue] = useState<number>(state.userBudget);
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

    // Small delay for the animation before navigating
    setTimeout(() => {
      router.push("/meal-plan");
    }, 600);
  }, [inputValue, setBudget, router]);

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
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Outer glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-[28px] blur-sm opacity-60" />

      {/* Main card */}
      <div
        className={`
          relative overflow-hidden rounded-3xl
          bg-surface border transition-all duration-300
          ${isFocused ? "border-primary/40 shadow-[0_0_0_3px_rgba(27,122,61,0.1)]" : "border-outline-variant"}
        `}
        style={{ boxShadow: "var(--shadow-elevation-2)" }}
      >
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/[0.03] rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/[0.04] rounded-full translate-y-1/3 -translate-x-1/4" />

        <div className="relative p-6 sm:p-8">
          {/* Card header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-2xl bg-primary-container flex items-center justify-center">
              <Wallet className="w-5 h-5 text-on-primary-container" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-on-surface">
                Nhập ngân sách của bạn
              </h2>
              <p className="text-xs text-on-surface-variant">
                Chúng tôi sẽ gợi ý thực đơn tối ưu trong ngân sách của bạn
              </p>
            </div>
          </div>

          {/* VND Input Field */}
          <div className="mb-5">
            <label
              htmlFor="budget-input"
              className="block text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2"
            >
              Ngân sách mỗi ngày
            </label>
            <div
              className={`
                relative flex items-center gap-2 rounded-2xl border-2 px-5 py-4
                transition-all duration-200 bg-surface-container/50
                ${isFocused ? "border-primary bg-surface" : "border-outline-variant hover:border-outline"}
              `}
            >
              <span className="text-on-surface-variant font-semibold text-lg select-none">
                ₫
              </span>
              <input
                ref={inputRef}
                id="budget-input"
                type="text"
                inputMode="numeric"
                value={formatVNDDisplay(inputValue)}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                placeholder="0"
                aria-label="Nhập ngân sách đi chợ của bạn bằng Việt Nam Đồng"
                className="
                  flex-1 bg-transparent outline-none
                  text-3xl sm:text-4xl font-extrabold text-on-surface
                  placeholder:text-outline placeholder:font-normal
                  tracking-tight
                "
              />
              <span className="text-sm font-medium text-on-surface-variant select-none">
                VND
              </span>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-xs text-on-surface-variant font-medium self-center mr-1">
              Nhanh:
            </span>
            {budgetPresets.map((preset) => (
              <motion.button
                key={preset.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePresetClick(preset.value)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-semibold
                  transition-all duration-200 cursor-pointer
                  ${
                    inputValue === preset.value
                      ? "bg-primary text-on-primary shadow-sm"
                      : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                  }
                `}
                aria-label={`Set budget to ${preset.label} VND`}
              >
                {preset.label}
              </motion.button>
            ))}
          </div>

          {/* Smart insight */}
          <AnimatePresence mode="wait">
            {inputValue > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6"
              >
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-primary-container/40 border border-primary-container">
                  <TrendingUp className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-on-primary-container">
                      {inputValue >= 500000
                        ? "🎉 Ngân sách tuyệt vời! Bạn có thể lên thực đơn cao cấp cho cả tuần."
                        : inputValue >= 200000
                        ? "👍 Ngân sách tốt! Thích hợp cho 3-5 bữa ăn dinh dưỡng với nguyên liệu tươi ngon."
                        : inputValue >= 100000
                        ? "💡 Chúng tôi sẽ tối ưu chi phí — nhiều công thức nấu ăn tiết kiệm đang chờ bạn!"
                        : "🌱 Mỗi đồng đều quý giá! Hãy để AI tìm các lựa chọn tiết kiệm nhất cho bạn."}
                    </p>
                    <p className="text-xs text-on-surface-variant mt-1">
                      <CircleDollarSign className="w-3 h-3 inline mr-1" />
                      AI sẽ so sánh giá tại Bách Hóa Xanh, Winmart & Coop Food
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Plan My Meals button */}
          <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePlanMeals}
            disabled={inputValue <= 0 || isSubmitting}
            className={`
              w-full flex items-center justify-center gap-3
              py-4 px-6 rounded-2xl
              text-base font-bold tracking-wide
              transition-all duration-300 cursor-pointer
              ${
                inputValue > 0 && !isSubmitting
                  ? "gradient-primary text-on-primary shadow-lg hover:shadow-xl"
                  : "bg-surface-container-high text-outline cursor-not-allowed"
              }
            `}
            aria-label="Plan my meals with the set budget"
          >
            <AnimatePresence mode="wait">
              {isSubmitting ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  <span>AI đang lên thực đơn cho bạn…</span>
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center gap-3"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Lên thực đơn</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
