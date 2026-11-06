import type {Recipe} from '@/data/mockData';
import {recipeCost} from './recommendations';
import {manualCandidates,type DayMeals,type MealSlot} from './manual-meals';
export function catalogMealPlan(recipes:Recipe[],days:number,meals:string[],servings:number,budget:number) {
  const result:Recipe[]=[];
  const slots:Record<string,MealSlot>={'Sáng':'breakfast','Trưa':'lunch','Tối':'dinner'};
  for(let day=0;day<days;day++){
    const selected:DayMeals={};
    const allowance=Math.floor(budget/days);
    for(let index=0;index<meals.length;index++){
      const slot=slots[meals[index]];
      const used=Object.values(selected).reduce((sum,r)=>sum+(r?recipeCost(r,servings):0),0);
      const candidates=manualCandidates(recipes,selected,slot,allowance,servings);
      const viable=candidates.filter(r=>{
        const rest=recipes.filter(x=>x.id!==r.id&&!Object.values(selected).some(s=>s?.id===x.id)).map(x=>recipeCost(x,servings)).sort((a,b)=>a-b);
        const needed=meals.length-index-1;
        return rest.length>=needed && used+recipeCost(r,servings)+rest.slice(0,needed).reduce((a,b)=>a+b,0)<=allowance;
      });
      const recipe=viable[day%Math.min(viable.length,5)];
      if(!recipe)throw Error('Ngân sách hoặc danh mục chưa đủ để chọn các món khác nhau. Hãy tăng ngân sách hoặc giảm số bữa.');
      selected[slot]=recipe;result.push(recipe);
    }
  }
  return result;
}
