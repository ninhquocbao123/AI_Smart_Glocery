import type { Recipe } from '@/data/mockData';
import { recommend, recipeCost } from './recommendations';
export type MealSlot = 'breakfast' | 'lunch' | 'dinner';
export type DayMeals = Partial<Record<MealSlot, Recipe | undefined>>;
export function manualCandidates(catalog: Recipe[], selected: DayMeals, slot: MealSlot, budget: number, servings: number, diet?: string, allergies?: string[], excludedIds: readonly string[] = []) {
  const others = Object.entries(selected).filter(([key]) => key !== slot).map(([,recipe]) => recipe).filter((r): r is Recipe => !!r);
  const remaining = Math.max(0, budget - others.reduce((sum,r)=>sum+recipeCost(r,servings),0));
  return recommend(Number.POSITIVE_INFINITY,servings,diet,allergies,catalog)
    .filter(r => r.active !== false && !excludedIds.includes(r.id) && !others.some(other => other.id === r.id))
    .sort((a,b) => {
      // Explicit meal tags take priority; quick recipes are useful for breakfast.
      const score = (r:Recipe) => (r.tags.some(t=>t.toLowerCase().includes(slot==='breakfast'?'sáng':slot==='lunch'?'trưa':'tối'))?100:0)
        + (slot==='breakfast' && /^(bánh mì|cháo|phở|bún|mì|xôi|trứng)/i.test(r.title)?60:0)
        + (slot==='breakfast' && r.prepTime+r.cookTime<=30?20:0);
      const aCost=recipeCost(a,servings), bCost=recipeCost(b,servings);
      const aOver=aCost>remaining, bOver=bCost>remaining;
      if(aOver!==bOver)return aOver?1:-1;
      if(aOver)return aCost-bCost || score(b)-score(a);
      return score(b)-score(a) || aCost-bCost;
    });
}
