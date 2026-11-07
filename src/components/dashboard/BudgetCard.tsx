"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, Wallet, ArrowRight, Sparkles } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import styles from "./Home.module.css";

const PRESET_BUDGETS = [50000, 100000, 150000, 200000];

export default function BudgetCard() {
  const { state, setBudget, setServings } = useAppContext();
  const router = useRouter();
  const [budget, updateBudget] = useState(state.userBudget);
  const [servings, updateServings] = useState(state.servings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (budget < 1000 || budget > 50000000) return;
    setBudget(budget);
    setServings(servings);
    router.push("/ai-suggestions");
  };

  return (
    <form className={styles.budget} onSubmit={handleSubmit}>
      <div className={styles.sectionTitle}>
        <div className={styles.titleIconBox}>
          <Wallet size={20} strokeWidth={2} />
        </div>
        <div>
          <h2>Bữa ngon vừa túi tiền</h2>
          <p>Nhập số tiền & khẩu phần, AI sẽ tìm món tối ưu nhất.</p>
        </div>
      </div>

      <div className={styles.budgetFields}>
        {/* Budget input */}
        <label className={styles.fieldLabel}>
          <span>Ngân sách dự kiến</span>
          <div className={styles.moneyField}>
            <input
              type="number"
              aria-label="Ngân sách dự kiến"
              min={1000}
              max={50000000}
              step="any"
              required
              value={budget}
              onChange={(e) => updateBudget(Number(e.target.value))}
            />
            <span className={styles.moneyCurrency}>VNĐ</span>
          </div>
        </label>

        {/* Servings stepper */}
        <label className={styles.fieldLabel}>
          <span>Số người ăn</span>
          <div className={styles.servingsField}>
            <button
              type="button"
              className={styles.servingsBtn}
              aria-label="Giảm số người"
              disabled={servings <= 1}
              onClick={() => updateServings(Math.max(1, servings - 1))}
            >
              −
            </button>
            <div className={styles.servingsValue}>
              <Users size={16} className="text-emerald-700" />
              <span>{servings} người</span>
            </div>
            <button
              type="button"
              className={styles.servingsBtn}
              aria-label="Tăng số người"
              disabled={servings >= 20}
              onClick={() => updateServings(Math.min(20, servings + 1))}
            >
              +
            </button>
          </div>
        </label>
      </div>

      {/* Preset pills */}
      <div className={styles.presets}>
        {PRESET_BUDGETS.map((amount) => (
          <button
            key={amount}
            type="button"
            className={styles.presetBtn}
            aria-pressed={budget === amount}
            onClick={() => updateBudget(amount)}
          >
            {amount / 1000}k
          </button>
        ))}
      </div>

      <button type="submit" className={styles.submitBtn}>
        <Sparkles size={17} />
        <span>Gợi ý món ăn thông minh</span>
        <ArrowRight size={16} />
      </button>
    </form>
  );
}
