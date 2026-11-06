"use client";
import {useRef,useState,useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ChevronLeft,ChevronRight,Plus,Sun,Sunset,Moon,X,ArrowRight,ShoppingBasket,CalendarDays} from 'lucide-react';
import {useAppContext,type CartItem} from '@/context/AppContext';
import {useCatalogRecipes} from '@/lib/use-catalog-recipes';
import {vietnamToday,weekStart,shiftDate,dayDate} from '@/lib/weekly-calendar';
import type {Recipe} from '@/data/mockData';
import calendar from './WeeklyCalendar.module.css';
import {manualCandidates,type MealSlot,type DayMeals} from '@/lib/manual-meals';
import {recipeCost} from '@/lib/recommendations';
import {formatVND} from '@/lib/priceUtils';
import RecipeImage from '@/components/ui/RecipeImage';
import UserPageHeader from '@/components/ui/UserPageHeader';
import styles from '@/components/ui/WorkspacePages.module.css';
const DAYS=['T2','T3','T4','T5','T6','T7','CN'];
const MEALS=[{id:'breakfast',label:'Sáng',icon:Sun},{id:'lunch',label:'Trưa',icon:Sunset},{id:'dinner',label:'Tối',icon:Moon}] as const;
export default function WeeklyMealPlanPage(){
  const recipes=useCatalogRecipes();
  const {state,addMultipleToCart}=useAppContext();
  const [plan,setPlan]=useState<Record<string,DayMeals>>({});
  const [servings,setServings]=useState(state.servings);
  const [budget,setBudget]=useState(state.userBudget);
  const [today,setToday]=useState(vietnamToday);
  const [week,setWeek]=useState(()=>weekStart(vietnamToday()));
  const [dirty,setDirty]=useState(false);
  const saveLock=useRef(false);
  const pageRef=useRef<HTMLDivElement>(null);
  const [loadedWeek,setLoadedWeek]=useState('');
  const router=useRouter();
  const [day,setDay]=useState(()=>DAYS.find(d=>dayDate(weekStart(vietnamToday()),d)===vietnamToday())??'T2');
  const [slot,setSlot]=useState<MealSlot>('breakfast');
  const [query,setQuery]=useState('');
  const [message,setMessage]=useState('');
  const [version,setVersion]=useState(0),[loaded,setLoaded]=useState(false),[saving,setSaving]=useState(false);
  useEffect(()=>{const tick=()=>setToday(vietnamToday());const timer=setInterval(tick,30000);window.addEventListener('focus',tick);return()=>{clearInterval(timer);window.removeEventListener('focus',tick);};},[]);
  useEffect(()=>{const controller=new AbortController();fetch('/api/weekly-plan?week='+week,{signal:controller.signal}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.message);if(controller.signal.aborted)return;setPlan(d.plan??{});if(d.budget)setBudget(d.budget);if(d.servings)setServings(d.servings);setVersion(d.version);setLoadedWeek(week);setLoaded(true);setDirty(false);}).catch(e=>{if(e.name!=='AbortError')setMessage(e.message);});return()=>controller.abort();},[week]);
  useEffect(()=>{const warn=(e:BeforeUnloadEvent)=>{if(dirty){e.preventDefault();}};window.addEventListener('beforeunload',warn);return()=>window.removeEventListener('beforeunload',warn);},[dirty]);
  useEffect(()=>{const guard=(e:MouseEvent)=>{const target=e.target;if(!(target instanceof Element))return;const action=target.closest('a,button');if((saving||dirty)&&action&&(action.tagName==='A'||!pageRef.current?.contains(action))){e.preventDefault();e.stopPropagation();setMessage(saving?'Đang lưu thực đơn, vui lòng chờ một chút.':'Chưa lưu được thực đơn. Hãy bấm Thử lưu lại trước khi rời trang.');}};document.addEventListener('click',guard,true);return()=>document.removeEventListener('click',guard,true);},[saving,dirty]);
  const ready=loaded&&loadedWeek===week;
  const past=dayDate(week,day)<today;
  const editable=ready&&!saving&&!past;
  function navigateWeek(target:string){if(saveLock.current)return;if(dirty){setMessage('Hãy bấm Thử lưu lại trước khi chuyển tuần để giữ các món đã chọn.');return;}setLoaded(false);setWeek(target);setDay(target===weekStart(today)?DAYS.find(d=>dayDate(target,d)===today)??'T2':'T2');setDirty(false);setMessage('');picker.current?.close();}
  function setWeeklyPlanMeal(selectedDay:string,meal:MealSlot,recipe:Recipe|undefined){
    if(!ready||saveLock.current||dayDate(week,selectedDay)<vietnamToday())return;
    if(recipe&&Object.entries(plan).some(([d,meals])=>Object.entries(meals).some(([s,r])=>(d!==selectedDay||s!==meal)&&r?.id===recipe.id)))return;
    void savePlan({...plan,[selectedDay]:{...plan[selectedDay],[meal]:recipe}});
  }
  async function savePlan(nextPlan:Record<string,DayMeals>=plan){
    if(!ready||saveLock.current)return;
    saveLock.current=true;setSaving(true);setDirty(true);setPlan(nextPlan);
    try{
      const payload=Object.fromEntries(Object.entries(nextPlan).map(([day,meals])=>[day,Object.fromEntries(Object.entries(meals).filter(([,r])=>r).map(([slot,r])=>[slot,r!.id]))]));
      const r=await fetch('/api/weekly-plan',{method:'PUT',keepalive:true,headers:{'Content-Type':'application/json'},body:JSON.stringify({plan:payload,version,weekStart:week,budget,servings})});
      const d=await r.json();if(!r.ok)throw Error(d.message);
      setVersion(d.version);setDirty(false);setMessage('Đã tự động lưu thực đơn vào tài khoản.');
    }catch(e){setMessage('Chưa lưu được thực đơn: '+(e as Error).message+' Bạn có thể thử lưu lại.');}
    finally{saveLock.current=false;setSaving(false);}
  }

  const picker=useRef<HTMLDialogElement>(null);
  const selected=plan[day]??{};
  const total=Object.values(selected).reduce((s,r)=>s+(r?recipeCost(r,servings):0),0);
  const count=Object.values(selected).filter(Boolean).length;
  const usedIds=Object.values(plan).flatMap(meals=>Object.values(meals).filter(r=>!!r).map(r=>r!.id));
  const candidates=(meals:DayMeals,meal:MealSlot)=>manualCandidates(recipes,meals,meal,budget,servings,state.user?.diet,state.user?.allergies,usedIds);
  const costWithoutSlot=Object.entries(selected).reduce((sum,[key,r])=>sum+(key!==slot&&r?recipeCost(r,servings):0),0);
  const options=candidates(selected,slot).filter(r=>r.title.toLocaleLowerCase('vi').includes(query.toLocaleLowerCase('vi')));
  const open=(meal:MealSlot)=>{if(!editable)return;setSlot(meal);setQuery('');picker.current?.showModal();};
  function suggest(){
    if(!editable)return;
    const next:DayMeals={...selected};let added=0;
    for(const meal of MEALS){if(next[meal.id])continue;const recipe=candidates(next,meal.id)[0];if(recipe){next[meal.id]=recipe;added++;}}
    if(added)void savePlan({...plan,[day]:next});
    const nextTotal=Object.values(next).reduce((sum,r)=>sum+(r?recipeCost(r,servings):0),0);
    const emptyCount=MEALS.filter(m=>!next[m.id]).length;
    setMessage(added?`Đã điền ${added} bữa, không trùng món trong tuần.${nextTotal>budget?' Vượt ngân sách dự kiến '+formatVND(nextTotal-budget)+'/ngày.':''}${emptyCount?' Còn '+emptyCount+' bữa trống vì hết món mới phù hợp khẩu vị.':''}`:count===3?'Ngày này đã đủ 3 bữa. Bấm Đổi món nếu bạn muốn thay món khác.':'Không còn món mới phù hợp khẩu vị và nguyên liệu cần tránh. Các món đã chọn trong tuần không được gợi ý lại.');
  }
  function addDay(){
    if(!editable)return;
    const meals=Object.values(selected).filter(r=>!!r);
    if(new Set(meals.map(r=>r.id)).size!==meals.length){setMessage('Ngày này có món trùng từ lịch cũ. Vui lòng đổi món trước khi thêm vào giỏ.');return;}
    const items:CartItem[]=meals.flatMap(r=>r.ingredients.map(ingredient=>({ingredient,recipeId:r.id,recipeTitle:r.title,quantity:Math.ceil(ingredient.quantity*servings/r.servings)})));
    if(items.length){addMultipleToCart(items);router.push('/grocery-store');}
  }
  return <div ref={pageRef} className={styles.page}>
    <UserPageHeader eyebrow="Kế hoạch trong tuần" title="Lên lịch bữa ăn thủ công" description="Tự chọn món cho sáng, trưa, tối. Mỗi ngày một thực đơn, không lặp lại món." action={<Link href="/meal-plan/ai" className="btn-outlined">Nhờ AI lên thực đơn <ArrowRight size={16}/></Link>}/>
    <div className="flex items-center gap-4" role="status"><span className="text-sm text-on-surface-variant">{!ready?'Đang tải lịch tuần này…':saving?'Đang tự động lưu…':dirty?'Chưa lưu được thay đổi.':'Tự động lưu vào tài khoản · Món đã chọn vẫn còn khi bạn quay lại.'}</span>{dirty&&!saving&&<button className="btn-filled" onClick={()=>void savePlan()}>Thử lưu lại</button>}</div>
    <nav className={calendar.navigation} aria-label="Chuyển tuần"><button disabled={saving} onClick={()=>navigateWeek(shiftDate(week,-7))}><ChevronLeft size={18}/> Tuần trước</button><div><strong>{week.split('-').reverse().join('/')} — {shiftDate(week,6).split('-').reverse().join('/')}</strong><button disabled={saving||week===weekStart(today)} onClick={()=>navigateWeek(weekStart(today))}>Về tuần hiện tại</button></div><button disabled={saving} onClick={()=>navigateWeek(shiftDate(week,7))}>Tuần sau <ChevronRight size={18}/></button></nav>
    {!ready&&<p role="status">{message||'Đang tải lịch…'}</p>}
    {ready&&<div className={styles.weekLayout}><section className={styles.panel}>
      <div className={styles.days} aria-label="Chọn ngày">{DAYS.map(d=><button key={d} aria-pressed={d===day} onClick={()=>{setDay(d);setMessage('');}}><span>{d==='CN'?'Chủ nhật':'Thứ '+d.slice(1)}</span><strong>{dayDate(week,d).slice(8)}/{dayDate(week,d).slice(5,7)}</strong><small>{dayDate(week,d)===today?"Hôm nay":dayDate(week,d)<today?"Chỉ xem":""}</small><small>{Object.values(plan[d]??{}).filter(Boolean).length}/3 bữa</small></button>)}</div>
      <div className={styles.sectionHeading}><div><h2>{day==='CN'?'Chủ nhật':`Thứ ${day.slice(1)}`}</h2><p>{servings} người · {state.user?.diet??'Không hạn chế'}</p></div><button disabled={!editable} onClick={suggest} className={styles.textButton}>Gợi ý bữa còn trống</button></div>
      {past&&<p className={styles.notice}>Ngày đã qua — chỉ xem lại thực đơn đã lưu, không thể thêm, đổi hoặc gợi ý món.</p>}<div className={styles.mealList}>{MEALS.map(({id,label,icon:Icon})=>{const recipe=selected[id];return <article className={styles.mealRow} key={id}><div className={styles.mealLabel}><Icon size={20}/><h3>Bữa {label.toLowerCase()}</h3></div>{recipe?<div className={styles.chosenMeal}><div className={styles.thumb}><RecipeImage recipeId={recipe.id} src={recipe.image} alt={recipe.title} variant="card" className="h-full"/></div><div><Link href={'/meal-plan/'+recipe.id}>{recipe.title}</Link><p>{formatVND(recipeCost(recipe,servings))} · {recipe.prepTime+recipe.cookTime} phút</p><div className={styles.inlineActions}><button disabled={!editable} onClick={()=>open(id)}>Đổi món</button><button disabled={!editable} onClick={()=>setWeeklyPlanMeal(day,id,undefined)}>Bỏ món</button></div></div></div>:<button disabled={!editable} className={styles.addMeal} onClick={()=>open(id)}><Plus size={20}/><span>{past?"Chưa lưu bữa ":"Chọn món "}{label.toLowerCase()}<small>Ưu tiên món vừa ngân sách, không trùng trong tuần</small></span></button>}</article>})}</div>
    </section><aside className={styles.sideColumn}><section className={styles.summary}><CalendarDays size={24}/><h2>Bữa ăn ngày {day}</h2><p>Đã chọn {count}/3 bữa · {servings} người</p><strong>{formatVND(total)}</strong><p>trên {formatVND(budget)} dự kiến / ngày</p><div className={styles.progress}><span style={{width:`${Math.min(100,budget>0?total/budget*100:0)}%`}}/></div>{total>budget&&<p role="status">Chi phí đang vượt ngân sách dự kiến.</p>}<button disabled={!count||!editable} onClick={addDay}><ShoppingBasket size={17}/>Mua nguyên liệu ngày này</button><small>Giá ước tính cho khẩu phần đã chọn, chưa gồm phí giao hàng.</small></section></aside></div>}
    {message&&<p role="status" className={styles.notice}>{message}</p>}
    <dialog ref={picker} className={styles.picker} onClick={e=>{if(e.target===e.currentTarget)picker.current?.close();}}><div className={styles.sectionHeading}><div><h2>Chọn món bữa {MEALS.find(m=>m.id===slot)?.label.toLowerCase()}</h2><p>{day} · {servings} người · Không trùng món trong tuần</p></div><button aria-label="Đóng danh sách món" onClick={()=>picker.current?.close()}><X size={22}/></button></div><input className={styles.search} aria-label="Tìm món cho bữa ăn" placeholder="Tìm tên món…" value={query} onChange={e=>setQuery(e.target.value)}/><div className={styles.recipeOptions}>{options.map(recipe=><button disabled={!editable} key={recipe.id} onClick={()=>{setWeeklyPlanMeal(day,slot,recipe);picker.current?.close();}}><div className={styles.thumb}><RecipeImage recipeId={recipe.id} src={recipe.image} alt="" variant="card" className="h-full"/></div><span><strong>{recipe.title}</strong><small>{formatVND(recipeCost(recipe,servings))} · {recipe.prepTime+recipe.cookTime} phút</small>{costWithoutSlot+recipeCost(recipe,servings)>budget&&<small style={{color:"#a16207"}}>Vượt dự kiến {formatVND(costWithoutSlot+recipeCost(recipe,servings)-budget)}/ngày</small>}</span><Plus size={18}/></button>)}</div>{!options.length&&<div className={styles.empty}><h3>Chưa có món phù hợp</h3><p>Thử tìm tên món khác. Danh sách chỉ gồm món chưa chọn trong tuần và phù hợp khẩu vị, nguyên liệu cần tránh trong hồ sơ. Ngân sách không giới hạn danh sách này.</p></div>}</dialog>
  </div>;
}
