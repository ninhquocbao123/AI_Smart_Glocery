"use client";

import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import { defaultPantryIngredients, type Ingredient, type Store } from "@/data/mockData";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface CartItem {
  ingredient: Ingredient;
  recipeId: string;
  recipeTitle: string;
  quantity: number;
}

export interface AppState {
  userBudget: number;
  cart: CartItem[];
  pantryIngredients: string[];
  selectedStore: Store | null;
}

// ─────────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────────

type Action =
  | { type: "SET_BUDGET"; payload: number }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }            // ingredient id
  | { type: "UPDATE_CART_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ADD_PANTRY_INGREDIENT"; payload: string }
  | { type: "REMOVE_PANTRY_INGREDIENT"; payload: string }
  | { type: "SET_PANTRY_INGREDIENTS"; payload: string[] }
  | { type: "SET_SELECTED_STORE"; payload: Store | null };

// ─────────────────────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────────────────────

const initialState: AppState = {
  userBudget: 500000, // 500,000 VND default budget
  cart: [],
  pantryIngredients: [...defaultPantryIngredients],
  selectedStore: null,
};

// ─────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_BUDGET":
      return { ...state, userBudget: action.payload };

    case "ADD_TO_CART": {
      const itemStore = action.payload.ingredient.store;
      const isDifferentStore = state.selectedStore !== null && state.selectedStore !== itemStore;
      const baseCart = isDifferentStore ? [] : state.cart;

      const existing = baseCart.find(
        (item) => item.ingredient.id === action.payload.ingredient.id
      );
      if (existing) {
        return {
          ...state,
          selectedStore: itemStore,
          cart: baseCart.map((item) =>
            item.ingredient.id === action.payload.ingredient.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, selectedStore: itemStore, cart: [...baseCart, action.payload] };
    }

    case "REMOVE_FROM_CART": {
      const remainingCart = state.cart.filter((item) => item.ingredient.id !== action.payload);
      return {
        ...state,
        selectedStore: remainingCart.length === 0 ? null : state.selectedStore,
        cart: remainingCart,
      };
    }

    case "UPDATE_CART_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.ingredient.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return { ...state, cart: [], selectedStore: null };

    case "SET_SELECTED_STORE":
      return { ...state, selectedStore: action.payload };

    case "ADD_PANTRY_INGREDIENT":
      if (state.pantryIngredients.includes(action.payload)) return state;
      return {
        ...state,
        pantryIngredients: [...state.pantryIngredients, action.payload],
      };

    case "REMOVE_PANTRY_INGREDIENT":
      return {
        ...state,
        pantryIngredients: state.pantryIngredients.filter(
          (ing) => ing !== action.payload
        ),
      };

    case "SET_PANTRY_INGREDIENTS":
      return { ...state, pantryIngredients: action.payload };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────

interface AppContextValue {
  state: AppState;

  // Budget
  setBudget: (budget: number) => void;

  // Cart
  addToCart: (item: CartItem) => void;
  removeFromCart: (ingredientId: string) => void;
  updateCartQuantity: (ingredientId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Pantry
  addPantryIngredient: (ingredient: string) => void;
  removePantryIngredient: (ingredient: string) => void;
  setPantryIngredients: (ingredients: string[]) => void;
  isInPantry: (ingredientName: string) => boolean;

  // Selected Store
  setSelectedStore: (store: Store | null) => void;

  // Budget helpers
  remainingBudget: number;
  budgetUsagePercent: number;
  isOverBudget: boolean;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ── Budget ──
  const setBudget = useCallback((budget: number) => {
    dispatch({ type: "SET_BUDGET", payload: budget });
  }, []);

  // ── Cart ──
  const addToCart = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  }, []);

  const removeFromCart = useCallback((ingredientId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: ingredientId });
  }, []);

  const updateCartQuantity = useCallback(
    (ingredientId: string, quantity: number) => {
      dispatch({
        type: "UPDATE_CART_QUANTITY",
        payload: { id: ingredientId, quantity },
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const cartTotal = state.cart.reduce(
    (sum, item) => sum + item.ingredient.price * item.quantity,
    0
  );

  const cartItemCount = state.cart.reduce(
    (count, item) => count + item.quantity,
    0
  );

  // ── Pantry ──
  const addPantryIngredient = useCallback((ingredient: string) => {
    dispatch({ type: "ADD_PANTRY_INGREDIENT", payload: ingredient });
  }, []);

  const removePantryIngredient = useCallback((ingredient: string) => {
    dispatch({ type: "REMOVE_PANTRY_INGREDIENT", payload: ingredient });
  }, []);

  const setPantryIngredients = useCallback((ingredients: string[]) => {
    dispatch({ type: "SET_PANTRY_INGREDIENTS", payload: ingredients });
  }, []);

  const setSelectedStore = useCallback((store: Store | null) => {
    dispatch({ type: "SET_SELECTED_STORE", payload: store });
  }, []);

  const isInPantry = useCallback(
    (ingredientName: string) =>
      state.pantryIngredients.some(
        (p) => p.toLowerCase() === ingredientName.toLowerCase()
      ),
    [state.pantryIngredients]
  );

  // ── Budget Helpers ──
  const remainingBudget = state.userBudget - cartTotal;
  const budgetUsagePercent =
    state.userBudget > 0
      ? Math.min((cartTotal / state.userBudget) * 100, 100)
      : 0;
  const isOverBudget = cartTotal > state.userBudget;

  const value: AppContextValue = {
    state,
    setBudget,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    cartTotal,
    cartItemCount,
    addPantryIngredient,
    removePantryIngredient,
    setPantryIngredients,
    isInPantry,
    setSelectedStore,
    remainingBudget,
    budgetUsagePercent,
    isOverBudget,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
