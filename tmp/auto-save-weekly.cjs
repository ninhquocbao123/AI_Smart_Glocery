const fs=require('fs');const p='src/app/meal-plan/weekly/page.tsx';let s=fs.readFileSync(p,'utf8');s=s.replace("const [dirty,setDirty]=useState(false);", "const [dirty,setDirty]=useState(false);\n  const saveLock=useRef(false);\n  const pageRef=useRef<HTMLDivElement>(null);");s=s.replace("  const ready=loaded&&loadedWeek===week;",`  useEffect(()=>{const guard=(e:MouseEvent)=>{const target=e.target;if(!(target instanceof Element))return;const action=target.closest('a,button');if((saving||dirty)&&action&&(action.tagName==='A'||!pageRef.current?.contains(action))){e.preventDefault();e.stopPropagation();setMessage(saving?'Đang lưu thực đơn, vui lòng chờ một chút.':'Chưa lưu được thực đơn. Hãy bấm Thử lưu lại trước khi rời trang.');}};document.addEventListener('click',guard,true);return()=>document.removeEventListener('click',guard,true);},[saving,dirty]);
  const ready=loaded&&loadedWeek===week;`);
const a=s.indexOf('  function setWeeklyPlanMeal('), b=s.indexOf('\n\n  const picker',a);
s=s.slice(0,a)+`  function setWeeklyPlanMeal(selectedDay:string,meal:MealSlot,recipe:Recipe|undefined){
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
  }`+s.slice(b);
s=s.replace('next[meal.id]=recipe;setWeeklyPlanMeal(day,meal.id,recipe);added++;','next[meal.id]=recipe;added++;');s=s.replace('    const nextTotal=', '    if(added)void savePlan({...plan,[day]:next});\n    const nextTotal=');s=s.replace('return <div className={styles.page}>','return <div ref={pageRef} className={styles.page}>');
const start=s.indexOf('    <div className="flex items-center gap-4">');const end=s.indexOf('\n    <nav',start);
s=s.slice(0,start)+`    <div className="flex items-center gap-4" role="status"><span className="text-sm text-on-surface-variant">{!ready?'Đang tải lịch tuần này…':saving?'Đang tự động lưu…':dirty?'Chưa lưu được thay đổi.':'Tự động lưu vào tài khoản · Món đã chọn vẫn còn khi bạn quay lại.'}</span>{dirty&&!saving&&<button className="btn-filled" onClick={()=>void savePlan()}>Thử lưu lại</button>}</div>`+s.slice(end);
fs.writeFileSync(p,s);
