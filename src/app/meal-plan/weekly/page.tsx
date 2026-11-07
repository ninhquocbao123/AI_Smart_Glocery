"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Sun,
  Sunset,
  Moon,
  X,
  ArrowRight,
  ShoppingBasket,
  CalendarDays,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useAppContext, type CartItem } from "@/context/AppContext";
import { useCatalogRecipes } from "@/lib/use-catalog-recipes";
import { vietnamToday, weekStart, shiftDate, dayDate } from "@/lib/weekly-calendar";
import type { Recipe } from "@/data/mockData";
import calendar from "./WeeklyCalendar.module.css";
import { manualCandidates, type MealSlot, type DayMeals } from "@/lib/manual-meals";
import { recipeCost } from "@/lib/recommendations";
import { formatVND } from "@/lib/priceUtils";
import RecipeImage from "@/components/ui/RecipeImage";
import UserPageHeader from "@/components/ui/UserPageHeader";

const DAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MEALS = [
  { id: "breakfast", label: "Sáng", icon: Sun },
  { id: "lunch", label: "Trưa", icon: Sunset },
  { id: "dinner", label: "Tối", icon: Moon },
] as const;

export default function WeeklyMealPlanPage() {
  const recipes = useCatalogRecipes();
  const { state, addMultipleToCart } = useAppContext();
  const [plan, setPlan] = useState<Record<string, DayMeals>>({});
  const [servings, setServings] = useState(state.servings);
  const [budget, setBudget] = useState(state.userBudget);
  const [today, setToday] = useState(vietnamToday);
  const [week, setWeek] = useState(() => weekStart(vietnamToday()));
  const [dirty, setDirty] = useState(false);
  const saveLock = useRef(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const [loadedWeek, setLoadedWeek] = useState("");
  const router = useRouter();
  const [day, setDay] = useState(
    () => DAYS.find((d) => dayDate(weekStart(vietnamToday()), d) === vietnamToday()) ?? "T2",
  );
  const [slot, setSlot] = useState<MealSlot>("breakfast");
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [version, setVersion] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const tick = () => setToday(vietnamToday());
    const timer = setInterval(tick, 30000);
    window.addEventListener("focus", tick);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", tick);
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/weekly-plan?week=" + week, { signal: controller.signal })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.message);
        if (controller.signal.aborted) return;
        setPlan(d.plan ?? {});
        if (d.budget) setBudget(d.budget);
        if (d.servings) setServings(d.servings);
        setVersion(d.version);
        setLoadedWeek(week);
        setLoaded(true);
        setDirty(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") setMessage(e.message);
      });
    return () => controller.abort();
  }, [week]);

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    const guard = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const action = target.closest("a,button");
      if (
        (saving || dirty) &&
        action &&
        (action.tagName === "A" || !pageRef.current?.contains(action))
      ) {
        e.preventDefault();
        e.stopPropagation();
        setMessage(
          saving
            ? "Đang lưu thực đơn, vui lòng chờ một chút."
            : "Chưa lưu được thực đơn. Hãy bấm Thử lưu lại trước khi rời trang.",
        );
      }
    };
    document.addEventListener("click", guard, true);
    return () => document.removeEventListener("click", guard, true);
  }, [saving, dirty]);

  const ready = loaded && loadedWeek === week;
  const past = dayDate(week, day) < today;
  const editable = ready && !saving && !past;

  function navigateWeek(target: string) {
    if (saveLock.current) return;
    if (dirty) {
      setMessage("Hãy bấm Thử lưu lại trước khi chuyển tuần để giữ các món đã chọn.");
      return;
    }
    setLoaded(false);
    setWeek(target);
    setDay(target === weekStart(today) ? DAYS.find((d) => dayDate(target, d) === today) ?? "T2" : "T2");
    setDirty(false);
    setMessage("");
    picker.current?.close();
  }

  function setWeeklyPlanMeal(selectedDay: string, meal: MealSlot, recipe: Recipe | undefined) {
    if (!ready || saveLock.current || dayDate(week, selectedDay) < vietnamToday()) return;
    if (
      recipe &&
      Object.entries(plan).some(([d, meals]) =>
        Object.entries(meals).some(([s, r]) => (d !== selectedDay || s !== meal) && r?.id === recipe.id),
      )
    )
      return;
    void savePlan({ ...plan, [selectedDay]: { ...plan[selectedDay], [meal]: recipe } });
  }

  async function savePlan(nextPlan: Record<string, DayMeals> = plan) {
    if (!ready || saveLock.current) return;
    saveLock.current = true;
    setSaving(true);
    setDirty(true);
    setPlan(nextPlan);
    try {
      const payload = Object.fromEntries(
        Object.entries(nextPlan).map(([d, meals]) => [
          d,
          Object.fromEntries(
            Object.entries(meals)
              .filter(([, r]) => r)
              .map(([s, r]) => [s, r!.id]),
          ),
        ]),
      );
      const r = await fetch("/api/weekly-plan", {
        method: "PUT",
        keepalive: true,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: payload, version, weekStart: week, budget, servings }),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.message);
      setVersion(d.version);
      setDirty(false);
      setMessage("Đã tự động lưu thực đơn vào tài khoản.");
    } catch (e) {
      setMessage("Chưa lưu được thực đơn: " + (e as Error).message + " Bạn có thể thử lưu lại.");
    } finally {
      saveLock.current = false;
      setSaving(false);
    }
  }

  const picker = useRef<HTMLDialogElement>(null);
  const selected = plan[day] ?? {};
  const total = Object.values(selected).reduce((s, r) => s + (r ? recipeCost(r, servings) : 0), 0);
  const count = Object.values(selected).filter(Boolean).length;
  const usedIds = Object.values(plan).flatMap((meals) =>
    Object.values(meals)
      .filter((r) => !!r)
      .map((r) => r!.id),
  );
  const candidates = (meals: DayMeals, meal: MealSlot) =>
    manualCandidates(recipes, meals, meal, budget, servings, state.user?.diet, state.user?.allergies, usedIds);
  const costWithoutSlot = Object.entries(selected).reduce(
    (sum, [key, r]) => sum + (key !== slot && r ? recipeCost(r, servings) : 0),
    0,
  );
  const options = candidates(selected, slot).filter((r) =>
    r.title.toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")),
  );

  const open = (meal: MealSlot) => {
    if (!editable) return;
    setSlot(meal);
    setQuery("");
    picker.current?.showModal();
  };

  function suggest() {
    if (!editable) return;
    const next: DayMeals = { ...selected };
    let added = 0;
    for (const meal of MEALS) {
      if (next[meal.id]) continue;
      const recipe = candidates(next, meal.id)[0];
      if (recipe) {
        next[meal.id] = recipe;
        added++;
      }
    }
    if (added) void savePlan({ ...plan, [day]: next });
    const nextTotal = Object.values(next).reduce((sum, r) => sum + (r ? recipeCost(r, servings) : 0), 0);
    const emptyCount = MEALS.filter((m) => !next[m.id]).length;
    setMessage(
      added
        ? `Đã điền ${added} bữa, không trùng món trong tuần.${
            nextTotal > budget ? " Vượt ngân sách dự kiến " + formatVND(nextTotal - budget) + "/ngày." : ""
          }${emptyCount ? " Còn " + emptyCount + " bữa trống vì hết món mới phù hợp khẩu vị." : ""}`
        : count === 3
        ? "Ngày này đã đủ 3 bữa. Bấm Đổi món nếu bạn muốn thay món khác."
        : "Không còn món mới phù hợp khẩu vị và nguyên liệu cần tránh. Các món đã chọn trong tuần không được gợi ý lại.",
    );
  }

  function addDay() {
    if (!editable) return;
    const meals = Object.values(selected).filter((r) => !!r);
    if (new Set(meals.map((r) => r.id)).size !== meals.length) {
      setMessage("Ngày này có món trùng từ lịch cũ. Vui lòng đổi món trước khi thêm vào giỏ.");
      return;
    }
    const items: CartItem[] = meals.flatMap((r) =>
      r.ingredients.map((ingredient) => ({
        ingredient,
        recipeId: r.id,
        recipeTitle: r.title,
        quantity: Math.ceil((ingredient.quantity * servings) / r.servings),
      })),
    );
    if (items.length) {
      addMultipleToCart(items);
      router.push("/grocery-store");
    }
  }

  return (
    <div ref={pageRef} className={calendar.page}>
      <UserPageHeader
        eyebrow="KẾ HOẠCH BỮA ĂN 7 NGÀY"
        title="Lên lịch thực đơn cả tuần"
        description="Chủ động chuẩn bị trước bữa sáng, trưa, tối. Mỗi ngày một thực đơn riêng biệt, đủ chất và không lo lặp món."
        action={
          <Link
            href="/meal-plan/ai"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition-all shadow-emerald-700/20"
          >
            <Sparkles size={16} />
            <span>Nhờ AI lên thực đơn tự động</span>
          </Link>
        }
      />

      {/* Auto-save & Status Banner */}
      <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 shadow-sm flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={15} className="text-emerald-600" />
          <span>
            {!ready
              ? "Đang tải lịch tuần này…"
              : saving
              ? "Đang tự động lưu thay đổi…"
              : dirty
              ? "Chưa lưu được thay đổi gần nhất."
              : "Thực đơn tự động lưu vào tài khoản và giữ nguyên khi bạn quay lại."}
          </span>
        </div>
        {dirty && !saving && (
          <button
            type="button"
            className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold"
            onClick={() => void savePlan()}
          >
            Thử lưu lại
          </button>
        )}
      </div>

      {/* Week Navigator */}
      <nav className={calendar.navigation} aria-label="Chuyển tuần">
        <button disabled={saving} onClick={() => navigateWeek(shiftDate(week, -7))}>
          <ChevronLeft size={16} /> Tuần trước
        </button>
        <div className={calendar.weekCenter}>
          <strong className={calendar.weekTitle}>
            {week.split("-").reverse().join("/")} — {shiftDate(week, 6).split("-").reverse().join("/")}
          </strong>
          <button
            className={calendar.todayBtn}
            disabled={saving || week === weekStart(today)}
            onClick={() => navigateWeek(weekStart(today))}
          >
            Về tuần hiện tại
          </button>
        </div>
        <button disabled={saving} onClick={() => navigateWeek(shiftDate(week, 7))}>
          Tuần sau <ChevronRight size={16} />
        </button>
      </nav>

      {/* Main Week Workspace */}
      {ready && (
        <div className={calendar.plannerLayout}>
          {/* Main Panel */}
          <section className={calendar.mainPanel}>
            {/* 7-Day Selector Cards */}
            <div className={calendar.daysGrid} aria-label="Chọn ngày trong tuần">
              {DAYS.map((d) => {
                const dateStr = dayDate(week, d);
                const isToday = dateStr === today;
                const isPast = dateStr < today;
                const mealsCount = Object.values(plan[d] ?? {}).filter(Boolean).length;

                return (
                  <button
                    key={d}
                    type="button"
                    className={calendar.dayCard}
                    aria-pressed={d === day}
                    onClick={() => {
                      setDay(d);
                      setMessage("");
                    }}
                  >
                    <span className={calendar.dayName}>{d === "CN" ? "Chủ nhật" : "Thứ " + d.slice(1)}</span>
                    <strong className={calendar.dayDate}>
                      {dateStr.slice(8)}/{dateStr.slice(5, 7)}
                    </strong>
                    {isToday ? (
                      <span className={`${calendar.dayBadge} ${calendar.dayBadgeToday}`}>Hôm nay</span>
                    ) : isPast ? (
                      <span className={calendar.dayBadge}>Chỉ xem</span>
                    ) : (
                      <span className={calendar.dayBadge}>{mealsCount === 3 ? "Đủ bữa" : "Chờ món"}</span>
                    )}
                    <span className={calendar.dayCount}>{mealsCount}/3 bữa</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Day Header */}
            <div className={calendar.dayHeaderRow}>
              <div>
                <h2 className={calendar.dayHeaderTitle}>{day === "CN" ? "Chủ nhật" : `Thứ ${day.slice(1)}`}</h2>
                <p className={calendar.dayHeaderSub}>
                  Khẩu phần {servings} người · Chế độ: {state.user?.diet ?? "Không hạn chế"}
                </p>
              </div>
              <button disabled={!editable} onClick={suggest} className={calendar.suggestBtn}>
                <Sparkles size={14} />
                <span>Gợi ý bữa còn trống</span>
              </button>
            </div>

            {past && (
              <p className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs font-medium border border-amber-200 mb-4">
                Ngày đã qua — chỉ xem lại thực đơn đã lưu, không thể thêm hoặc đổi món.
              </p>
            )}

            {/* Meal Slots List */}
            <div className={calendar.mealList}>
              {MEALS.map(({ id, label, icon: Icon }) => {
                const recipe = selected[id];
                return (
                  <article className={calendar.mealCard} key={id}>
                    <div className={calendar.mealSlotTitle}>
                      <Icon size={18} />
                      <span>Bữa {label.toLowerCase()}</span>
                    </div>

                    {recipe ? (
                      <div className={calendar.mealContentFilled}>
                        <div className={calendar.mealThumb}>
                          <RecipeImage
                            recipeId={recipe.id}
                            src={recipe.image}
                            alt={recipe.title}
                            variant="card"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className={calendar.mealInfo}>
                          <Link href={"/meal-plan/" + recipe.id} className={calendar.mealTitleLink}>
                            {recipe.title}
                          </Link>
                          <p className={calendar.mealMeta}>
                            {formatVND(recipeCost(recipe, servings))} · {recipe.prepTime + recipe.cookTime} phút
                          </p>
                          <div className={calendar.mealActions}>
                            <button
                              type="button"
                              disabled={!editable}
                              onClick={() => open(id)}
                              className={calendar.mealActionBtn}
                            >
                              Đổi món
                            </button>
                            <button
                              type="button"
                              disabled={!editable}
                              onClick={() => setWeeklyPlanMeal(day, id, undefined)}
                              className={`${calendar.mealActionBtn} ${calendar.mealActionBtnDanger}`}
                            >
                              Bỏ món
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        disabled={!editable}
                        className={calendar.emptySlotBtn}
                        onClick={() => open(id)}
                      >
                        <Plus size={18} />
                        <span>
                          {past ? "Chưa lưu món " : "Chọn món "} cho bữa {label.toLowerCase()}
                        </span>
                      </button>
                    )}
                  </article>
                );
              })}
            </div>
          </section>

          {/* Right Summary Sidebar */}
          <aside className={calendar.sideColumn}>
            <section className={calendar.summaryCard}>
              <div className={calendar.summaryHeader}>
                <CalendarDays size={20} className="text-emerald-700" />
                <span>Bữa ăn ngày {day}</span>
              </div>
              <p className={calendar.summarySub}>
                Đã lên {count}/3 bữa · Khẩu phần {servings} người
              </p>

              <div className={calendar.summaryPriceBox}>
                <strong className={calendar.summaryPrice}>{formatVND(total)}</strong>
                <p className={calendar.summaryBudget}>
                  Ngân sách dự kiến: <strong>{formatVND(budget)}</strong> / ngày
                </p>
                <div className={calendar.progressBar}>
                  <div
                    className={`${calendar.progressFill} ${total > budget ? calendar.progressOver : ""}`}
                    style={{ width: `${Math.min(100, budget > 0 ? (total / budget) * 100 : 0)}%` }}
                  />
                </div>
              </div>

              {total > budget && (
                <p role="status" className="p-2.5 bg-amber-50 text-amber-800 text-xs font-semibold rounded-lg border border-amber-200">
                  ⚠️ Chi phí đang vượt ngân sách dự kiến của ngày.
                </p>
              )}

              <button
                type="button"
                disabled={!count || !editable}
                onClick={addDay}
                className={calendar.buyIngredientsBtn}
              >
                <ShoppingBasket size={17} />
                <span>Mua nguyên liệu ngày này</span>
              </button>

              <small className={calendar.summaryNote}>
                Giá ước tính cho khẩu phần đã chọn, chưa gồm phí giao hàng.
              </small>
            </section>
          </aside>
        </div>
      )}

      {message && (
        <p role="status" className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-sm font-semibold">
          {message}
        </p>
      )}

      {/* Modal Picker for Selecting Recipe */}
      <dialog
        ref={picker}
        className={calendar.picker}
        onClick={(e) => {
          if (e.target === e.currentTarget) picker.current?.close();
        }}
      >
        <div className={calendar.pickerHead}>
          <div>
            <h2>Chọn món bữa {MEALS.find((m) => m.id === slot)?.label.toLowerCase()}</h2>
            <p>
              Thứ {day.slice(1)} · Khẩu phần {servings} người · Không trùng món trong tuần
            </p>
          </div>
          <button
            type="button"
            className={calendar.pickerClose}
            aria-label="Đóng danh sách món"
            onClick={() => picker.current?.close()}
          >
            <X size={18} />
          </button>
        </div>

        <input
          className={calendar.pickerSearch}
          aria-label="Tìm món cho bữa ăn"
          placeholder="Tìm theo tên món (thịt kho, canh cua, cá hấp)…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className={calendar.optionsList}>
          {options.map((recipe) => (
            <button
              disabled={!editable}
              key={recipe.id}
              className={calendar.optionItem}
              onClick={() => {
                setWeeklyPlanMeal(day, slot, recipe);
                picker.current?.close();
              }}
            >
              <div className={calendar.mealThumb}>
                <RecipeImage recipeId={recipe.id} src={recipe.image} alt="" variant="card" className="h-full w-full object-cover" />
              </div>
              <div className={calendar.optionInfo}>
                <strong>{recipe.title}</strong>
                <small>
                  {formatVND(recipeCost(recipe, servings))} · {recipe.prepTime + recipe.cookTime} phút
                </small>
                {costWithoutSlot + recipeCost(recipe, servings) > budget && (
                  <small className="text-amber-600 font-bold">
                    Vượt dự kiến {formatVND(costWithoutSlot + recipeCost(recipe, servings) - budget)}/ngày
                  </small>
                )}
              </div>
              <Plus size={18} className="text-emerald-700 shrink-0" />
            </button>
          ))}
        </div>

        {!options.length && (
          <div className="py-12 text-center text-slate-400">
            <h3 className="font-bold text-slate-700 text-sm">Chưa có món phù hợp</h3>
            <p className="text-xs text-slate-500 mt-1">
              Thử tìm tên khác hoặc kiểm tra lại sở thích trong hồ sơ.
            </p>
          </div>
        )}
      </dialog>
    </div>
  );
}
