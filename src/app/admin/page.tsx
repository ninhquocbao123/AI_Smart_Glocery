"use client";
import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import RecipeCatalog from '@/components/admin/RecipeCatalog';
import OperationsPanel from '@/components/admin/OperationsPanel';
import Image from 'next/image';
import type { Recipe, Store } from '@/data/mockData';
import { formatVND } from '@/lib/priceUtils';

type Draft = Recipe & { cookingGuide: NonNullable<Recipe['cookingGuide']> };
const blankStep = () => ({ title: '', duration: '', heat: '', detail: '', cue: '' });
function blank(): Draft {
  return { id: '', title: '', description: '', image: '', difficulty: 'Dễ', cuisine: 'Việt Nam', servings: 2, prepTime: 10, cookTime: 20, tags: [], ingredients: [], totalPrice: 0, instructions: [], cookingGuide: { baseServings: 2, measures: [], pantry: [], waiting: '', equipment: [], finish: '', steps: [blankStep()] } };
}
const field = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-600';
const button = 'rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-green-50 disabled:opacity-50';
function Field({ label, children }: { label: string; children: ReactNode }) { return <label className="grid gap-1.5 text-sm font-medium text-slate-700">{label}{children}</label>; }
async function request(url: string, options?: RequestInit) {
  const response = await fetch(url, { cache: 'no-store', ...options });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Không thể thực hiện. Vui lòng thử lại.');
  return data;
}
export default function AdminPage() {
  const [operations,setOperations]=useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]), [allowed, setAllowed] = useState(false), [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null), [message, setMessage] = useState(''), [busy, setBusy] = useState(false);
  async function refresh() { const data = await request('/api/admin/recipes'); setRecipes(data.recipes); setAllowed(true); }
  useEffect(() => { let active = true; request('/api/admin/recipes').then(data => { if (active) { setRecipes(data.recipes); setAllowed(true); } }).catch(e => { if (active) setMessage(e.message); }).finally(() => { if (active) setLoading(false); }); return () => { active = false; }; }, []);
  function edit(recipe: Recipe) {
    const copy = structuredClone(recipe);
    setDraft({ ...copy, cookingGuide: copy.cookingGuide ?? { ...blank().cookingGuide, measures: copy.ingredients.map(i => ({ ingredientId: i.id, name: i.name, quantity: i.quantity, unit: i.unit })), steps: copy.instructions.map(detail => ({ ...blankStep(), detail })) } });
    setMessage(''); window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  function update<K extends keyof Draft>(key: K, value: Draft[K]) { setDraft(d => d ? { ...d, [key]: value } : d); }
  function guide<K extends keyof Draft['cookingGuide']>(key: K, value: Draft['cookingGuide'][K]) { setDraft(d => d ? { ...d, cookingGuide: { ...d.cookingGuide, [key]: value } } : d); }
  async function upload(file?: File) {
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { setMessage('Ảnh tối đa 3 MB.'); return; }
    setBusy(true); setMessage('Đang tải ảnh…');
    try { const data = await request('/api/admin/images', { method: 'POST', headers: { 'Content-Type': file.type }, body: file }); update('image', data.image); setMessage('Đã tải ảnh lên. Hãy lưu món để áp dụng.'); }
    catch (e) { setMessage((e as Error).message); } finally { setBusy(false); }
  }
  async function save() {
    if (!draft) return;
    setBusy(true); setMessage('');
    try { await request('/api/admin/recipes', { method: draft.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) }); await refresh(); setDraft(null); setMessage('Đã lưu món ăn vào danh mục.'); }
    catch (e) { setMessage((e as Error).message); } finally { setBusy(false); }
  }
  async function toggle(recipe: Recipe) {
    setBusy(true);
    try { await request('/api/admin/recipes', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: recipe.id, active: recipe.active === false }) }); await refresh(); setMessage(recipe.active === false ? 'Đã hiện món ăn.' : 'Đã ẩn món khỏi danh mục.'); }
    catch (e) { setMessage((e as Error).message); } finally { setBusy(false); }
  }
  const total = draft?.ingredients.reduce((sum, i) => sum + i.price * i.quantity, 0) ?? 0;
  if (allowed && operations) return <div className="space-y-5"><button className={button} onClick={()=>setOperations(false)}>← Quản lý món ăn</button><OperationsPanel /></div>;
  return <main className="mx-auto pb-12 text-slate-900">
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6"><div><p className="text-green-700 text-sm font-bold tracking-widest">THỰC ĐƠN MỖI NGÀY</p><h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-2">Gian bếp của bạn.</h1><p className="text-slate-500 mt-2">Chăm chút từng món ăn, mang bữa ngon đến mọi nhà.</p></div>{allowed && <button type="button" className={button} onClick={()=>setOperations(true)}>Đơn hàng & cửa hàng →</button>}</div>
    {message && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 mb-5">{message}</p>}
    {loading ? <p>Đang kiểm tra quyền quản trị…</p> : !allowed ? <Link className={button} href="/auth/login">Đăng nhập bằng tài khoản quản trị</Link> : draft ? <form onSubmit={e => { e.preventDefault(); void save(); }}>
      <fieldset disabled={busy} className="space-y-6 disabled:opacity-70">
        <div className="flex items-center justify-between gap-3"><h2 className="text-2xl font-bold">{draft.id ? 'Chỉnh sửa món ăn' : 'Thêm món ăn mới'}</h2><button type="button" className={button} onClick={() => setDraft(null)}>Hủy chỉnh sửa</button></div>
        <section className="grid lg:grid-cols-2 gap-6 rounded-3xl border border-slate-200 bg-white p-5 md:p-7">
          <div><div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-green-50 flex items-center justify-center">{draft.image ? <Image src={draft.image} alt={draft.title || 'Ảnh xem trước'} fill unoptimized className="object-contain" /> : <p className="text-green-800">Thêm ảnh thành phẩm thật rõ nét</p>}</div><Field label="Ảnh món ăn · JPG, PNG, WebP · tối đa 3 MB"><input type="file" accept="image/jpeg,image/png,image/webp" className={field + ' mt-3'} onChange={e => void upload(e.target.files?.[0])} /></Field><p className="mt-3 text-sm text-slate-500">Ảnh được lưu cùng dữ liệu trên MongoDB. Hãy chọn ảnh khớp với nguyên liệu và cách nấu.</p></div>
          <div className="space-y-4"><Field label="Tên món"><input required minLength={2} maxLength={160} className={field} value={draft.title} onChange={e => update('title', e.target.value)} /></Field><Field label="Giới thiệu món"><textarea required minLength={10} maxLength={1500} rows={3} className={field} value={draft.description} onChange={e => update('description', e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-3"><Field label="Số người ăn"><input type="number" min={1} max={20} required className={field} value={draft.servings} onChange={e => update('servings', +e.target.value)} /></Field><Field label="Độ khó"><select className={field} value={draft.difficulty} onChange={e => update('difficulty', e.target.value as Recipe['difficulty'])}>{['Dễ', 'Trung bình', 'Khó'].map(v => <option key={v}>{v}</option>)}</select></Field>{(['prepTime', 'cookTime'] as const).map((key, i) => <Field key={key} label={i ? 'Nấu (phút)' : 'Sơ chế (phút)'}><input required type="number" min={0} max={1440} className={field} value={draft[key]} onChange={e => update(key, +e.target.value)} /></Field>)}</div>
            <Field label="Nhãn món ăn (phân cách bằng dấu phẩy)"><input className={field} value={draft.tags.join(',')} onChange={e => update('tags', e.target.value.split(','))} onBlur={() => update('tags', draft.tags.map(t => t.trim()).filter(Boolean))} /></Field>
            <div className="rounded-2xl bg-green-50 p-4"><p className="text-sm text-green-800">Chi phí nguyên liệu cho {draft.servings} người</p><strong className="text-3xl text-green-800">{formatVND(total)}</strong><p className="text-xs text-slate-500 mt-2">Giá tham khảo do nhóm nhập, chưa gồm giao hàng.</p></div>
          </div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7 space-y-4"><h2 className="text-xl font-bold">Nguyên liệu & định lượng</h2><p className="text-sm text-slate-500">Đơn giá × số lượng mua dùng để tính chi phí. Định lượng nấu là lượng thực tế cần dùng cho số người đã chọn.</p>
          {draft.ingredients.map((item, index) => <div key={index} className="rounded-2xl bg-slate-50 p-4 space-y-3"><div className="flex justify-between"><b>Nguyên liệu {index + 1}</b><button type="button" className="text-sm text-red-700" onClick={() => { update('ingredients', draft.ingredients.filter((_, i) => i !== index)); guide('measures', draft.cookingGuide.measures.filter((_, i) => i !== index)); }}>Bỏ nguyên liệu</button></div><div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(['name', 'unit', 'category'] as const).map((key, i) => <Field key={key} label={['Tên nguyên liệu', 'Đơn vị mua (gói, gram…)', 'Nhóm nguyên liệu'][i]}><input required className={field} value={item[key]} onChange={e => update('ingredients', draft.ingredients.map((v, n) => n === index ? { ...v, [key]: e.target.value } : v))} /></Field>)}
            <Field label="Cửa hàng tham khảo"><select className={field} value={item.store} onChange={e => update('ingredients', draft.ingredients.map((v, n) => n === index ? { ...v, store: e.target.value as Store } : v))}>{['Bach Hoa Xanh', 'Winmart', 'Coop Food'].map(s => <option key={s}>{s}</option>)}</select></Field>
            {(['price', 'quantity'] as const).map((key, i) => <Field key={key} label={i ? 'Số lượng mua' : 'Đơn giá (đ)'}><input required type="number" min={1} max={i ? 100000 : 10000000} className={field} value={item[key]} onChange={e => update('ingredients', draft.ingredients.map((v, n) => n === index ? { ...v, [key]: +e.target.value } : v))} /></Field>)}
            <Field label="Định lượng nấu"><input required type="number" min={0.01} step="any" className={field} value={draft.cookingGuide.measures[index]?.quantity ?? 1} onChange={e => guide('measures', draft.cookingGuide.measures.map((v, n) => n === index ? { ...v, quantity: +e.target.value } : v))} /></Field><Field label="Đơn vị nấu (g, ml, thìa…)"><input required className={field} value={draft.cookingGuide.measures[index]?.unit ?? ''} onChange={e => guide('measures', draft.cookingGuide.measures.map((v, n) => n === index ? { ...v, unit: e.target.value } : v))} /></Field>
          </div></div>)}
          <button className={button} type="button" onClick={() => { update('ingredients', [...draft.ingredients, { id: '', name: '', unit: 'gói', quantity: 1, price: 10000, store: 'Bach Hoa Xanh', category: 'Rau củ', image: '' }]); guide('measures', [...draft.cookingGuide.measures, { ingredientId: '', name: '', quantity: 100, unit: 'g' }]); }}>+ Thêm nguyên liệu</button>
          <h3 className="font-bold pt-3">Gia vị có sẵn (không tính vào giỏ)</h3>{draft.cookingGuide.pantry.map((p, i) => <div key={i} className="grid grid-cols-2 md:grid-cols-4 gap-3">{(['name', 'quantity', 'unit'] as const).map((key, j) => <Field key={key} label={['Tên gia vị', 'Lượng dùng', 'Đơn vị'][j]}><input required className={field} type={key === 'quantity' ? 'number' : 'text'} min={0.01} step="any" value={p[key]} onChange={e => guide('pantry', draft.cookingGuide.pantry.map((v, n) => n === i ? { ...v, [key]: key === 'quantity' ? +e.target.value : e.target.value } : v))} /></Field>)}<button type="button" className={button} onClick={() => guide('pantry', draft.cookingGuide.pantry.filter((_, n) => n !== i))}>Bỏ gia vị</button></div>)}<button type="button" className={button} onClick={() => guide('pantry', [...draft.cookingGuide.pantry, { name: '', quantity: 1, unit: 'thìa cà phê' }])}>+ Thêm gia vị có sẵn</button>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-5 md:p-7 space-y-5"><h2 className="text-xl font-bold">Cùng vào bếp</h2><div className="grid md:grid-cols-2 gap-4"><Field label="Dụng cụ (phân cách bằng dấu phẩy)"><input className={field} value={draft.cookingGuide.equipment.join(',')} onChange={e => guide('equipment', e.target.value.split(','))} onBlur={() => guide('equipment', draft.cookingGuide.equipment.map(x => x.trim()).filter(Boolean))} /></Field><Field label="Thời gian chờ / lưu ý trước khi nấu"><input className={field} value={draft.cookingGuide.waiting} onChange={e => guide('waiting', e.target.value)} /></Field></div>
          {draft.cookingGuide.steps.map((step, index) => <div key={index} className="rounded-2xl border border-green-100 bg-green-50/40 p-4 space-y-3"><div className="flex items-center justify-between"><b className="text-green-800">Bước {index + 1}</b><button type="button" className="text-sm text-red-700" onClick={() => guide('steps', draft.cookingGuide.steps.filter((_, i) => i !== index))}>Bỏ bước</button></div><div className="grid md:grid-cols-3 gap-3">{(['title', 'duration', 'heat'] as const).map((key, i) => <Field key={key} label={['Tên bước', 'Thời gian (ví dụ: 5–7 phút)', 'Mức lửa (hoặc không dùng lửa)'][i]}><input required className={field} value={step[key]} onChange={e => guide('steps', draft.cookingGuide.steps.map((v, n) => n === index ? { ...v, [key]: e.target.value } : v))} /></Field>)}</div><Field label="Thao tác cụ thể (cách cắt, thứ tự cho nguyên liệu, lượng nước…)"><textarea required minLength={10} rows={3} className={field} value={step.detail} onChange={e => guide('steps', draft.cookingGuide.steps.map((v, n) => n === index ? { ...v, detail: e.target.value } : v))} /></Field><Field label="Dấu hiệu đạt / cách nhận biết đã chín"><input required className={field} value={step.cue} onChange={e => guide('steps', draft.cookingGuide.steps.map((v, n) => n === index ? { ...v, cue: e.target.value } : v))} /></Field></div>)}
          <button className={button} type="button" onClick={() => guide('steps', [...draft.cookingGuide.steps, blankStep()])}>+ Thêm bước nấu</button><Field label="Thành phẩm & cách trình bày"><textarea required rows={3} className={field} value={draft.cookingGuide.finish} onChange={e => guide('finish', e.target.value)} /></Field>
        </section>
        <div className="sticky bottom-20 lg:bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white p-4 shadow-lg"><span>{draft.ingredients.length} nguyên liệu · {draft.cookingGuide.steps.length} bước · {formatVND(total)}</span><button disabled={!draft.image || !draft.ingredients.length || !draft.cookingGuide.steps.length} className="rounded-xl bg-green-700 text-white font-bold px-7 py-3 disabled:opacity-40" type="submit">{busy ? 'Đang lưu…' : 'Lưu món ăn'}</button></div>
      </fieldset>
    </form> : <>
      <RecipeCatalog recipes={recipes} busy={busy} onEdit={edit} onToggle={recipe=>void toggle(recipe)} onAdd={()=>{setDraft(blank());setMessage('');}} />
    </>}
  </main>;
}
