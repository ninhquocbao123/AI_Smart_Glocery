"use client";
import design from "./MealPlans.module.css";
import styles from "@/components/ui/WorkspacePages.module.css";
import RecipeImage from "@/components/ui/RecipeImage";
import UserPageHeader from "@/components/ui/UserPageHeader";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Recipe, Ingredient } from "@/data/mockData";
import { useAppContext } from "@/context/AppContext";
type Saved = {
  _id: string;
  source?: string;
  days: number;
  servings: number;
  budget: number;
  meals: { day: number; meal: string; recipe: Recipe }[];
};
type Member = { plan: string; mealRemaining: number; config: { days: number } };
type Shopping = Ingredient & {
  required: number;
  available: number;
  recipeId: string;
};
type Comparison = {
  store: string;
  complete: boolean;
  total?: number;
  deliveryFee?: number;
  mode?: string;
  message?: string;
};
export default function AIPlans() {
  const { addMultipleToCart } = useAppContext();
  const [plans, setPlans] = useState<Saved[]>([]),
    [engine,setEngine]=useState(""),
    [membership, setMembership] = useState<Member | null>(null),
    [active, setActive] = useState<Saved | null>(null),
    [days, setDays] = useState(1),
    [servings, setServings] = useState(2),
    [budget, setBudget] = useState(200000),
    [preferences, setPreferences] = useState(""),
    [pantry, setPantry] = useState(false),
    [meals, setMeals] = useState(["Trưa", "Tối"]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [items, setItems] = useState<Shopping[]>([]),
    [comparisons, setComparisons] = useState<Comparison[]>([]),
    [swapIndex, setSwapIndex] = useState(-1),
    [reason, setReason] = useState(""),
    [checked, setChecked] = useState<string[]>([]);
  async function refresh() {
    const r = await fetch("/api/meal-plans");
    const d = await r.json();
    if (!r.ok) throw Error(d.message);
    setPlans(d.plans);
    setMembership(d.membership);
  }
  useEffect(() => {
    fetch("/api/meal-plans")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.message);
        setEngine(d.engine??"gemini");
        setPlans(d.plans);
        setMembership(d.membership);
      })
      .catch((e) => setError(e.message));
  }, []);
  async function call(url: string, data: object) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const d = await r.json();
      if (!r.ok) throw Error(d.message);
      return d;
    } catch (e) {
      setError((e as Error).message);
      return null;
    } finally {
      setBusy(false);
    }
  }
  async function generate() {
    const d = await call("/api/meal-plans", {
      days,
      servings,
      budget,
      preferences,
      usePantry: pantry,
      meals,
    });
    if (d) {
      setActive(d.plan);
      setItems([]);
      setComparisons([]);
      await refresh().catch(e => setError((e as Error).message));
    }
  }
  async function shopping(compare = false) {
    if (!active) return;
    const d = await call("/api/meal-plans/shopping", {
      id: active._id,
      subtract: pantry,
      compare,
    });
    if (d) {
      setItems(d.items);
      setComparisons(d.comparisons);
      setChecked([]);
    }
  }
  return (
    <div className={`${styles.page} ${design.page}`}>
      <UserPageHeader eyebrow="TRỢ LÝ CHO BỮA ĂN" title="Thực đơn AI" description="Chọn số ngày, số người và ngân sách để tạo thực đơn." action={<Link href="/meal-plan/weekly" className="btn-outlined">Lịch bữa ăn →</Link>}/>
      <p className={styles.quota}>
        <strong>{membership?.mealRemaining ?? "…"}</strong> lượt tạo thực đơn còn lại trong chu kỳ.{" "}
        <Link href="/membership" className="underline text-emerald-700">
          Xem quyền lợi thành viên
        </Link>
      </p>
      {engine==="catalog" && <p role="status" className={styles.notice}>Đang dùng gợi ý từ danh mục, chưa kết nối AI. Hệ thống lọc theo ngân sách, chế độ ăn và nguyên liệu cần tránh trong hồ sơ. Mỗi lần tạo thành công vẫn dùng một lượt thực đơn.</p>}
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      <div className={design.builder}><aside className={design.builderIntro}><span>01 / CHUẨN BỊ</span><h2>Bữa ngon bắt đầu<br/>từ kế hoạch nhỏ.</h2><p>Bạn chọn khẩu phần và ngân sách. Phần còn lại để chúng tôi gợi ý.</p><div><strong>{membership?.mealRemaining ?? "—"}</strong><p>lượt tạo thực đơn còn lại</p></div><Link href="/profile">Điều chỉnh khẩu vị trong hồ sơ →</Link></aside><form
        onSubmit={(e) => {
          e.preventDefault();
          void generate();
        }}
        className={`${styles.form} ${design.form}`}
      >
        <div className={styles.formTitle}><h2>Hôm nay bạn muốn ăn thế nào?</h2><p>Thiết lập thực đơn phù hợp với nhịp sống của bạn.</p></div>
        <label>
          Số ngày
          <input
            type="number"
            min={1}
            max={membership?.config.days ?? 1}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="block border rounded-xl p-3 w-full"
          />
        </label>
        <label>
          Số người
          <input
            type="number"
            min={1}
            max={12}
            value={servings}
            onChange={(e) => setServings(Number(e.target.value))}
            className="block border rounded-xl p-3 w-full"
          />
        </label>
        <label>
          Ngân sách tổng (đ)
          <input
            type="number"
            min={10000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="block border rounded-xl p-3 w-full"
          />
        </label>
        <label className={styles.full}>
          Sở thích, khẩu vị hoặc nguyên liệu muốn tránh
          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="block border rounded-xl p-3 w-full"
            placeholder="Ví dụ: Ít cay, thích món gà, hạn chế dầu mỡ, ưu tiên nấu nhanh dưới 25 phút…"
          />
        </label>
        <div className={`${styles.mealChecks} ${styles.full}`}>
          {["Sáng", "Trưa", "Tối"].map((x) => (
            <label key={x}>
              <input
                type="checkbox"
                checked={meals.includes(x)}
                onChange={(e) =>
                  setMeals(
                    e.target.checked
                      ? [...meals, x]
                      : meals.filter((m) => m !== x),
                  )
                }
              />{" "}
              {x}
            </label>
          ))}
        </div>
        {membership?.plan === "plus" && (
          <label className={design.pantryCheck}>
            <input
              type="checkbox"
              checked={pantry}
              onChange={(e) => setPantry(e.target.checked)}
            />{" "}
            Ưu tiên / trừ nguyên liệu có sẵn
          </label>
        )}
        <button
          disabled={busy || !membership || !meals.length || membership.mealRemaining <= 0}
          className={design.generate}
        >
          {busy ? "Đang xử lý…" : engine==="catalog" ? "Gợi ý từ danh mục" : "Tạo thực đơn"}
        </button>
      </form></div>
      <div className={design.resultsHeading}><div><span>02 / THỰC ĐƠN CỦA BẠN</span><h2>Mỗi ngày, một bữa ngon.</h2></div><p>Chọn một thực đơn đã lưu hoặc tạo mới ở trên.</p></div>
      {!active && <section className={styles.empty}><h3>Chưa chọn thực đơn</h3><p>Tạo thực đơn mới hoặc chọn từ danh sách đã lưu.</p></section>}
      {plans.length > 0 && (
        <select
          aria-label="Thực đơn đã lưu"
          className={design.savedSelect}
          value={active?._id ?? ""}
          onChange={(e) => {
            setActive(plans.find((p) => p._id === e.target.value) ?? null);
            setItems([]);
            setComparisons([]);
            setSwapIndex(-1);
            setReason("");
          }}
        >
          <option value="">Xem thực đơn đã lưu</option>
          {plans.map((p, i) => (
            <option key={p._id} value={p._id}>
              Thực đơn {plans.length - i} · {p.days} ngày · {p.servings} người
            </option>
          ))}
        </select>
      )}
      {active && (
        <>
          <p className={design.cost}>
            {active.source==="catalog"?"Gợi ý từ danh mục · ":""}Chi phí thực phẩm ước tính:{" "}
            {Math.round(
              active.meals.reduce(
                (s, m) =>
                  s +
                  (m.recipe.totalPrice * active.servings) / m.recipe.servings,
                0,
              ),
            ).toLocaleString("vi-VN")}
            đ / ngân sách {active.budget.toLocaleString("vi-VN")}đ
          </p>
          {active.meals.reduce(
            (s, m) =>
              s + (m.recipe.totalPrice * active.servings) / m.recipe.servings,
            0,
          ) > active.budget && (
            <p className="text-orange-700">
              Thực đơn vượt ngân sách dự kiến. Bạn có thể đổi món hoặc điều
              chỉnh yêu cầu.
            </p>
          )}
          <div className={design.days}>
            {Array.from(new Set(active.meals.map(m => m.day))).sort((a,b) => a-b).map(day => <section className={design.day} key={day}><div className={design.dayHeading}><h3>Ngày {String(day).padStart(2, "0")}</h3><span>{active.meals.filter(m => m.day === day).length} bữa · {active.servings} người</span></div><div className={design.recipeGrid}>{active.meals.map((m, i) => m.day !== day ? null : (
              <article
                key={i}
                className={design.recipe}
              >
                <div className={design.photo}><RecipeImage recipeId={m.recipe.id} src={m.recipe.image} alt={m.recipe.title} variant="card" className="h-full"/></div>
                <p className={design.mealLabel}>
                  Ngày {m.day} · {m.meal}
                </p>
                <h2 className="font-bold text-xl">{m.recipe.title}</h2>
                <p>
                  {m.recipe.prepTime + m.recipe.cookTime} phút ·{" "}
                  {active.servings} người
                </p>
                <Link href={"/meal-plan/" + m.recipe.id} className="underline">
                  Xem cách nấu
                </Link>
                {membership?.plan !== "free" && (
                  <button
                    className="block underline"
                    disabled={busy}
                    onClick={() => { setSwapIndex(swapIndex === i ? -1 : i); setReason(""); }}
                  >
                    Đổi món (1 lượt chat)
                  </button>
                )}
                {swapIndex === i && (
                  <div className="space-y-2">
                    <input
                      aria-label="Lý do đổi món"
                      placeholder="Lý do đổi món"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className="border p-2 w-full"
                    />
                    <button
                      disabled={busy || !reason.trim()}
                      onClick={async () => {
                        const d = await call("/api/meal-plans", {
                          action: "swap",
                          id: active._id,
                          index: i,
                          reason,
                        });
                        if (d) {
                          setActive(d.plan);
                          setSwapIndex(-1);
                          setItems([]);
                          setComparisons([]);
                          await refresh();
                        }
                      }}
                    >
                      Xác nhận đổi món
                    </button>
                  </div>
                )}
              </article>
            ))}</div></section>)}
          </div>
          {membership?.plan !== "free" && (
            <div className={design.shoppingActions}>
              <button
                disabled={busy}
                onClick={() => void shopping()}
                className="bg-emerald-700 text-white rounded-xl p-3"
              >
                Tạo danh sách đi chợ
              </button>
              {membership?.plan === "plus" && (
                <button
                  disabled={busy}
                  onClick={() => void shopping(true)}
                  className="border rounded-xl p-3"
                >
                  So sánh cửa hàng
                </button>
              )}
            </div>
          )}
        </>
      )}
      {items.length > 0 && (
        <section className="border rounded-2xl p-5 space-y-3">
          <h2 className="text-xl font-bold">Danh sách đi chợ</h2>
          {items.map((i, index) => (
            <label key={index} className="flex flex-wrap gap-3 items-center">
              <input
                type="checkbox"
                checked={checked.includes(i.id)}
                onChange={(e) =>
                  setChecked(
                    e.target.checked
                      ? [...checked, i.id]
                      : checked.filter((x) => x !== i.id),
                  )
                }
              />
              <span className="flex-1">
                {i.name} · cần {i.required.toFixed(1)}, có{" "}
                {i.available.toFixed(1)} {i.unit}
              </span>
              <input
                aria-label={"Số lượng mua " + i.name}
                className="border rounded p-2 w-24"
                type="number"
                min={0}
                step="any"
                value={i.quantity}
                onChange={(e) =>
                  setItems(
                    items.map((x, j) =>
                      j === index
                        ? {
                            ...x,
                            quantity: Math.max(0, Number(e.target.value)),
                          }
                        : x,
                    ),
                  )
                }
              />
              <span>{i.unit}</span>
            </label>
          ))}
          <button
            onClick={() => {
              addMultipleToCart(
                items
                  .filter((i) => i.quantity > 0 && !checked.includes(i.id))
                  .map((i) => ({
                    ingredient: i,
                    quantity: Math.ceil(i.quantity),
                    recipeId: i.recipeId,
                    recipeTitle: "Thực đơn AI",
                  })),
              );
              setError("Đã thêm danh sách vào giỏ hàng.");
            }}
            className="bg-emerald-700 text-white rounded-xl p-3"
          >
            Thêm phần chưa mua vào giỏ
          </button>
          <Link href="/grocery-store" className="ml-4 underline">
            Mở giỏ hàng
          </Link>
        </section>
      )}
      {comparisons.length > 0 && (
        <section className="grid sm:grid-cols-3 gap-4">
          {comparisons.map((c) => (
            <article key={c.store} className="border rounded-2xl p-5">
              <h3 className="font-bold">{c.store}</h3>
              <p>
                {c.complete
                  ? `${c.total?.toLocaleString("vi-VN")}đ (gồm phí giao hàng)`
                  : c.message}
              </p>
              {c.mode === "demo" && <p className="text-sm">Giá tham khảo</p>}
            </article>
          ))}
        </section>
      )}
      <p className="text-sm text-gray-500">
        Chi phí là ước tính. Kiểm tra nguyên liệu và nhãn thực phẩm nếu bạn có
        dị ứng. Thực đơn đã lưu không tự trừ nguyên liệu trong tủ lạnh.
      </p>
    </div>
  );
}
