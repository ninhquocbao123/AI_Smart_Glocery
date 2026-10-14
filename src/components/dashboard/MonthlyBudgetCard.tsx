"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Target, Receipt, TrendingDown, Plus, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { formatVND } from "@/lib/priceUtils";

export default function MonthlyBudgetCard() {
  const { state, setMonthlyBudgetTarget, addExtraExpense, remainingMonthlyBudget, suggestedDailyBudget } = useAppContext();
  
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [expenseAmount, setExpenseAmount] = useState("");
  const [targetAmount, setTargetAmount] = useState(state.monthlyBudgetTarget.toString());
  const [isEditingTarget, setIsEditingTarget] = useState(false);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(expenseAmount.replace(/\D/g, ""), 10);
    if (amount && amount > 0) {
      addExtraExpense(amount);
      setExpenseAmount("");
      setShowExpenseModal(false);
    }
  };

  const handleSaveTarget = () => {
    const amount = parseInt(targetAmount.replace(/\D/g, ""), 10);
    if (amount && amount > 0) {
      setMonthlyBudgetTarget(amount);
    }
    setIsEditingTarget(false);
  };

  const budgetUsagePercent = state.monthlyBudgetTarget > 0 
    ? Math.min((state.extraExpenses / state.monthlyBudgetTarget) * 100, 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-surface rounded-3xl p-6 md:p-8 shadow-sm border border-outline-variant"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
            <Target className="w-6 h-6 text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-on-surface">Ngân sách tháng này</h2>
            <p className="text-sm text-on-surface-variant">Quản lý chi tiêu tổng quát</p>
          </div>
        </div>
        <button 
          onClick={() => setShowExpenseModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-error/10 text-error rounded-xl font-bold text-sm hover:bg-error/20 transition-colors"
        >
          <Plus className="w-4 h-4" /> Ghi nhận chi tiêu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-surface-container border border-outline-variant">
          <div className="text-sm font-semibold text-on-surface-variant mb-1">Mục tiêu tháng</div>
          {isEditingTarget ? (
            <div className="flex items-center gap-2 mt-2">
              <input 
                type="text" 
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="w-full bg-surface border border-primary px-3 py-1.5 rounded-lg text-sm font-bold outline-none"
              />
              <button onClick={handleSaveTarget} className="text-xs font-bold text-primary bg-primary/10 px-3 py-2 rounded-lg">Lưu</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black text-on-surface">{formatVND(state.monthlyBudgetTarget)}</div>
              <button onClick={() => setIsEditingTarget(true)} className="text-xs text-primary hover:underline">Sửa</button>
            </div>
          )}
        </div>

        <div className="p-5 rounded-2xl bg-error-container/30 border border-error/20">
          <div className="text-sm font-semibold text-error/80 mb-1 flex items-center gap-1.5"><Receipt className="w-4 h-4"/> Đã chi ngoài</div>
          <div className="text-2xl font-black text-error">{formatVND(state.extraExpenses)}</div>
        </div>

        <div className="p-5 rounded-2xl bg-primary-container border border-primary/20">
          <div className="text-sm font-semibold text-primary/80 mb-1">Ngân sách ngày gợi ý</div>
          <div className="text-2xl font-black text-primary">{formatVND(suggestedDailyBudget)}</div>
          <div className="text-xs text-on-surface-variant mt-1">Dựa trên số tiền còn lại</div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex justify-between text-xs font-semibold text-on-surface-variant mb-2">
          <span>Đã dùng {budgetUsagePercent.toFixed(0)}%</span>
          <span>Còn lại: {formatVND(remainingMonthlyBudget)}</span>
        </div>
        <div className="w-full h-3 rounded-full bg-surface-container-high overflow-hidden">
          <div 
            className={`h-full rounded-full ${budgetUsagePercent > 80 ? 'bg-error' : budgetUsagePercent > 50 ? 'bg-secondary' : 'bg-primary'}`}
            style={{ width: `${budgetUsagePercent}%` }}
          />
        </div>
      </div>

      {/* Expense Modal */}
      <AnimatePresence>
        {showExpenseModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-surface rounded-3xl p-6 shadow-xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg">Ghi nhận chi tiêu</h3>
                <button onClick={() => setShowExpenseModal(false)} className="p-1 hover:bg-surface-container rounded-full"><X className="w-5 h-5"/></button>
              </div>
              <form onSubmit={handleAddExpense}>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant ml-1">Số tiền (VND)</label>
                    <input 
                      type="text"
                      required
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="VD: 500000"
                      className="w-full mt-1 px-4 py-3 rounded-xl bg-surface-container border border-outline-variant outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <button type="submit" className="w-full py-3 rounded-xl bg-error text-white font-bold hover:bg-error/90 transition-colors">
                    Trừ vào ngân sách
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
