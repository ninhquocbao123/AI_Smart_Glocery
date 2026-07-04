// ─────────────────────────────────────────────────────────────
// Price Comparison Utility
//
// Since each ingredient in mock data is assigned to one store,
// this utility simulates what the same ingredient would cost
// at other stores with realistic price variation.
// ─────────────────────────────────────────────────────────────

import type { Ingredient, Store } from "@/data/mockData";

// Deterministic pseudo-random based on ingredient id
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

// Price multipliers for each store (relative base variation)
const storeMultipliers: Record<Store, number> = {
  "Bach Hoa Xanh": 0.95,  // Generally cheapest
  "Winmart":        1.05,  // Slightly premium
  "Coop Food":     1.00,   // Middle ground
};

/**
 * Get the estimated price of an ingredient at a specific store.
 * If it's the ingredient's original store, return the original price.
 * Otherwise, apply a deterministic variation.
 */
export function getPriceAtStore(ingredient: Ingredient, store: Store): number {
  if (ingredient.store === store) {
    return ingredient.price * ingredient.quantity;
  }

  const baseTotal = ingredient.price * ingredient.quantity;
  const variation = ((hashCode(ingredient.id + store) % 20) - 10) / 100; // -10% to +10%
  const multiplier = storeMultipliers[store] + variation;

  return Math.round(baseTotal * multiplier);
}

/**
 * Get total price of a list of ingredients at a specific store.
 */
export function getTotalAtStore(ingredients: Ingredient[], store: Store): number {
  return ingredients.reduce((sum, ing) => sum + getPriceAtStore(ing, store), 0);
}

/**
 * Find the cheapest store for a set of ingredients.
 */
export function findCheapestStore(
  ingredients: Ingredient[]
): { store: Store; total: number } {
  const stores: Store[] = ["Bach Hoa Xanh", "Winmart", "Coop Food"];
  let cheapest = { store: stores[0], total: getTotalAtStore(ingredients, stores[0]) };

  for (const store of stores.slice(1)) {
    const total = getTotalAtStore(ingredients, store);
    if (total < cheapest.total) {
      cheapest = { store, total };
    }
  }

  return cheapest;
}

/**
 * Format VND amount.
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}
