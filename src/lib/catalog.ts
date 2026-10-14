import { DEALS_DATA, recipes, type Ingredient, type Store } from "@/data/mockData";
import type { CartItem } from "@/context/AppContext";
import { getPriceAtStore } from "./priceUtils";

export const deliveryFees: Record<Store, number> = {
  Winmart: 15000,
  "Bach Hoa Xanh": 5000,
  "Coop Food": 20000,
};

export function catalogIngredient(id: string, recipeId: string): Ingredient | undefined {
  const deal = DEALS_DATA.find((item) => item.ingredientId === id);
  if (deal) return {
    id: deal.ingredientId, name: deal.name, price: deal.price,
    unit: deal.unit, quantity: 1, store: deal.store,
    category: deal.category, image: deal.image,
  };
  return recipes.find((recipe) => recipe.id === recipeId)?.ingredients.find((item) => item.id === id);
}

// Always quote the current catalog, including when reordering an old snapshot.
export function cartItemPrice(item: CartItem, store: Store): number {
  const ingredient = catalogIngredient(item.ingredient.id, item.recipeId);
  if (!ingredient) return 0;
  return getPriceAtStore(ingredient, store) / ingredient.quantity * item.quantity;
}
