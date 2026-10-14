"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, ChefHat, Clock, Flame, RotateCcw, ShoppingBasket, Users, Utensils } from "lucide-react";
import { useCatalogRecipes } from "@/lib/use-catalog-recipes";
import { recipeCost } from "@/lib/recommendations";
import { formatVND } from "@/lib/priceUtils";
import { useAppContext } from "@/context/AppContext";
import type { Recipe } from "@/data/mockData";

const amount = (quantity: number, factor: number) => new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 1 }).format(quantity * factor);

export default function DetailPage() {
  const recipes = useCatalogRecipes();
  const { id } = useParams();
  const recipe = recipes.find(r => r.id === id);
  if (!recipe) return <div className="card-outlined p-12 text-center"><h1 className="text-xl font-bold">Không tìm thấy món ăn</h1><Link href="/meal-plan" className="btn-filled mt-4">Xem món Việt</Link></div>;
  return <RecipeDetail key={recipe.id} recipe={recipe} />;
}

function RecipeDetail({ recipe }: { recipe: Recipe }) {
  const router = useRouter();
  const { state, addMultipleToCart } = useAppContext();
  const [servings, setServings] = useState(state.servings || recipe.servings);
  const [owned, setOwned] = useState<string[]>([]);
  const [completed, setCompleted] = useState<number[]>([]);
  const guide = recipe.cookingGuide;
  const factor = servings / (guide?.baseServings || recipe.servings);
  const steps = guide?.steps ?? recipe.instructions.map((detail, i) => ({ title: `Thực hiện bước ${i + 1}`, detail, duration: "", heat: "", cue: "" }));
  const ingredients = recipe.ingredients.map(i => ({ ...i, quantity: Math.ceil(i.quantity * servings / recipe.servings) }));
  const needed = ingredients.filter(i => !owned.includes(i.id));
  const total = needed.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const toggleStep = (index: number) => setCompleted(p => p.includes(index) ? p.filter(i => i !== index) : [...p, index]);
  return (
    <article className="space-y-8 pb-12">
      <Link href="/meal-plan" className="inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={17} /> Danh mục món Việt</Link>
      <section className="overflow-hidden rounded-[2rem] border border-outline-variant bg-surface shadow-sm">
        <figure className="relative aspect-[3/2] md:aspect-[16/9] max-h-[620px] bg-[#e8e4d9]">
          <Image src={recipe.image} alt={`Thành phẩm ${recipe.title}`} fill sizes="(max-width: 1280px) 100vw, 1200px" className="object-contain" preload />
          <span className="absolute top-4 left-4 md:top-6 md:left-6 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-primary shadow-sm"><ChefHat size={17} /> Bếp Việt mỗi ngày</span>
          <a href={recipe.image} target="_blank" rel="noreferrer" className="absolute right-4 bottom-4 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-on-surface shadow-sm inline-flex items-center gap-2">Xem ảnh đầy đủ <ArrowUpRight size={16} /></a>
        </figure>
        <div className="p-6 md:p-9 space-y-6">
          <div className="flex flex-col md:flex-row md:justify-between gap-5">
            <div className="max-w-2xl"><p className="uppercase tracking-[0.18em] text-xs font-bold text-primary mb-3">Món cơm nhà · {recipe.difficulty}</p><h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">{recipe.title}</h1><p className="text-on-surface-variant mt-4 leading-relaxed">{recipe.description}</p></div>
            <div className="md:text-right shrink-0"><p className="text-xs text-on-surface-variant mb-1">Dự kiến mua nguyên liệu</p><p className="text-2xl font-bold text-primary">{formatVND(recipeCost(recipe, servings))}</p><p className="text-xs text-on-surface-variant mt-2">Chưa gồm gia vị bổ sung và giao hàng</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-3 border-t border-outline-variant pt-5">
            <span className="rounded-xl bg-surface-container px-4 py-3 inline-flex gap-2 items-center text-sm"><Clock size={17} /> Sơ chế {recipe.prepTime} phút</span>
            <span className="rounded-xl bg-surface-container px-4 py-3 inline-flex gap-2 items-center text-sm"><Flame size={17} /> Nấu {recipe.cookTime} phút</span>
            <label className="rounded-xl bg-primary-container/40 px-4 py-2 flex items-center gap-3 text-sm font-semibold"><Users size={17} /> Khẩu phần <input aria-label="Số người ăn" type="number" min={1} max={20} value={servings} onChange={e => { const n = Number(e.target.value); if (Number.isInteger(n) && n >= 1 && n <= 20) setServings(n); }} className="w-16 rounded-lg bg-surface border border-outline-variant p-2 text-center" /> người</label>
          </div>
          {guide && <p className="text-sm text-on-surface-variant">Thời gian chờ: {guide.waiting}. Thời gian nấu tùy bếp và lượng thực phẩm; tăng khẩu phần nên chia mẻ khi cần.</p>}
          <p className="text-xs text-on-surface-variant">Ảnh gợi ý cách trình bày, gồm ảnh chụp và ảnh AI minh họa. Màu sắc thành phẩm có thể khác theo nguyên liệu và cách nấu. <a href="/images/food/credits.html" className="underline">Nguồn ảnh</a></p>
        </div>
      </section>
      <div className="grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)] gap-6 items-start">
        <aside className="space-y-5">
          <section className="rounded-3xl border border-outline-variant bg-surface p-5 md:p-7">
            <p className="text-xs font-bold tracking-widest text-primary mb-2">01 · CHUẨN BỊ</p><h2 className="text-2xl font-bold">Nguyên liệu</h2>
            <p className="text-sm leading-relaxed text-on-surface-variant mt-3">Lượng dùng cho <strong>{servings} người</strong>. Đánh dấu nguyên liệu đã có để bỏ khỏi giỏ mua.</p>
            <div className="mt-4 divide-y divide-outline-variant">
              {ingredients.map(i => { const measure = guide?.measures.find(m => m.ingredientId === i.id); return (
                <label key={i.id} className={`flex gap-3 items-start py-4 cursor-pointer ${owned.includes(i.id) ? "opacity-60" : ""}`}>
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-green-700" checked={owned.includes(i.id)} onChange={() => setOwned(p => p.includes(i.id) ? p.filter(x => x !== i.id) : [...p, i.id])} />
                  <span className="min-w-0 flex-1"><span className="font-semibold">{i.name}</span><span className="block mt-1 text-sm text-primary font-semibold">Dùng {measure ? `${amount(measure.quantity, factor)} ${measure.unit}` : `${i.quantity} ${i.unit}`}</span><span className="block text-xs mt-1 text-on-surface-variant">Mua: {i.quantity} {i.unit} · {formatVND(i.price * i.quantity)}</span></span>
                </label>
              ); })}
            </div>
            {guide && guide.pantry.length > 0 && <div className="mt-5 rounded-2xl bg-surface-container/70 p-4"><h3 className="font-bold">Chuẩn bị thêm tại bếp</h3><p className="text-xs leading-relaxed text-on-surface-variant mt-1 mb-3">Các lượng dưới đây dùng cho {servings} người, chưa cộng vào giỏ và giá dự kiến. Kiểm tra đủ trước khi bắt đầu.</p><ul className="space-y-2">{guide.pantry.map(i => <li key={i.name} className="flex justify-between gap-3 text-sm"><span>{i.name}</span><strong className="shrink-0">{amount(i.quantity, factor)} {i.unit}</strong></li>)}</ul></div>}
            <p className="text-xs leading-relaxed text-on-surface-variant mt-4">Lượng dùng và quy cách mua có thể khác nhau. Với trứng lẻ, đánh tan rồi lấy phần cần dùng; gia vị nên nêm từ ít đến vừa miệng. 1 thìa cà phê = 5 ml, 1 thìa canh = 15 ml.</p>
            <div className="border-t border-outline-variant mt-5 pt-5 flex items-center justify-between gap-3"><span className="font-semibold">Cần mua</span><strong className="text-xl text-primary">{formatVND(total)}</strong></div>
            <button disabled={!needed.length} className="btn-filled w-full mt-4" onClick={() => { addMultipleToCart(needed.map(i => ({ ingredient: i, quantity: i.quantity, recipeId: recipe.id, recipeTitle: recipe.title }))); router.push("/grocery-store"); }}><ShoppingBasket size={18} />{needed.length ? "Thêm nguyên liệu vào giỏ" : "Bạn đã có đủ nguyên liệu"}</button>
          </section>
          {guide && <section className="rounded-3xl border border-outline-variant bg-surface p-5 md:p-7"><h3 className="font-bold flex items-center gap-2"><Utensils size={18} /> Dụng cụ cần có</h3><ul className="mt-3 space-y-2 text-sm text-on-surface-variant">{guide.equipment.map(item => <li key={item}>• {item}</li>)}</ul></section>}
        </aside>
        <section className="rounded-3xl border border-outline-variant bg-surface p-5 md:p-7">
          <p className="text-xs font-bold tracking-widest text-primary mb-2">02 · THỰC HIỆN</p>
          <div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-bold">Cùng vào bếp</h2><button onClick={() => setCompleted([])} disabled={!completed.length} className="inline-flex items-center gap-1 text-sm text-primary disabled:opacity-40 p-2" aria-label="Đặt lại các bước đã hoàn thành"><RotateCcw size={15} /> Làm lại</button></div>
          <p className="mt-3 text-sm text-on-surface-variant" aria-live="polite">{completed.length === steps.length ? "Hoàn thành! Món ăn đã sẵn sàng để thưởng thức." : `Đã xong ${completed.length}/${steps.length} bước · Đánh dấu sau mỗi bước để theo dõi.`}</p>
          <div role="progressbar" aria-label="Tiến độ nấu ăn" aria-valuemin={0} aria-valuemax={steps.length} aria-valuenow={completed.length} className="h-2 bg-surface-container rounded-full mt-4 overflow-hidden"><div className="h-full bg-primary transition-all duration-300" style={{ width: `${completed.length / Math.max(1, steps.length) * 100}%` }} /></div>
          <ol className="mt-7 space-y-5">
            {steps.map((step, index) => <li key={index} className={`rounded-2xl border p-4 md:p-5 transition-colors ${completed.includes(index) ? "border-primary/30 bg-primary-container/15" : "border-outline-variant"}`}>
              <div className="flex items-start gap-3"><span className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center font-bold ${completed.includes(index) ? "bg-primary text-white" : "bg-primary-container text-primary"}`}>{completed.includes(index) ? <Check size={19} /> : String(index + 1).padStart(2, "0")}</span><div><h3 className="text-lg font-bold leading-snug">{step.title}</h3><div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-on-surface-variant">{step.duration && <span className="inline-flex items-center gap-1"><Clock size={13} />{step.duration}</span>}{step.heat && <span className="inline-flex items-center gap-1"><Flame size={13} />{step.heat}</span>}</div></div></div>
              <p className="mt-4 leading-7 text-sm md:text-base text-on-surface">{step.detail}</p>
              {step.cue && <div className="mt-4 rounded-xl bg-primary-container/25 p-3 text-sm leading-relaxed"><strong className="text-primary">Dấu hiệu đạt: </strong>{step.cue}</div>}
              <label className="inline-flex items-center gap-2 mt-4 py-1 text-sm font-semibold cursor-pointer"><input type="checkbox" className="h-4 w-4 accent-green-700" checked={completed.includes(index)} onChange={() => toggleStep(index)} />{completed.includes(index) ? "Đã hoàn thành" : `Hoàn thành bước ${index + 1}`}</label>
            </li>)}
          </ol>
          {guide && <div className="mt-6 rounded-2xl bg-primary-container/35 p-5"><h3 className="font-bold text-primary flex gap-2 items-center"><ChefHat size={20} /> Thành phẩm & cách bày món</h3><p className="mt-3 leading-relaxed">{guide.finish}</p><a href={recipe.image} target="_blank" rel="noreferrer" className="inline-flex gap-1 items-center text-sm font-semibold text-primary mt-3">Đối chiếu ảnh thành phẩm <ArrowUpRight size={15} /></a></div>}
          <p className="text-xs leading-relaxed text-on-surface-variant mt-5">Thời gian chỉ là ước lượng; kiểm tra độ chín thực tế, đặc biệt với thịt và trứng. <a className="underline" href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/safe-temperature-chart" target="_blank" rel="noreferrer">Tham khảo nhiệt độ chín an toàn</a>.</p>
        </section>
      </div>
    </article>
  );
}
