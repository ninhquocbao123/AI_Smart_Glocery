"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { type Ingredient, type Store, type Recipe } from "@/data/mockData";

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface CartItem {
  ingredient: Ingredient;
  recipeId: string;
  recipeTitle: string;
  quantity: number;
}

export interface WeeklyPlan {
  [day: string]: {
    breakfast?: Recipe;
    lunch?: Recipe;
    dinner?: Recipe;
  };
}

export interface UserProfile {
  id?: string;
  address?: string;
  diet?: string;
  allergies?: string[];
  monthlyBudgetTarget?: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  memberTier?: string;
  joinYear?: number;
  points?: string;
  orders?: number;
}

export interface AppState {
  userBudget: number;
  monthlyBudgetTarget: number;
  extraExpenses: number;
  servings: number; // Number of people
  cart: CartItem[];
  pantryIngredients: string[];
  selectedStore: Store | null;
  weeklyPlan: WeeklyPlan;
  user: UserProfile | null;
}

// ─────────────────────────────────────────────────────────────
// Actions
// ─────────────────────────────────────────────────────────────

type Action =
  | { type: "RESTORE"; payload: Partial<AppState> }
  | { type: "SET_BUDGET"; payload: number }
  | { type: "SET_SERVINGS"; payload: number }
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "ADD_MULTIPLE_TO_CART"; payload: CartItem[] }
  | { type: "REMOVE_FROM_CART"; payload: string } // ingredient id
  | { type: "UPDATE_CART_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "ADD_PANTRY_INGREDIENT"; payload: string }
  | { type: "REMOVE_PANTRY_INGREDIENT"; payload: string }
  | { type: "SET_PANTRY_INGREDIENTS"; payload: string[] }
  | { type: "SET_SELECTED_STORE"; payload: Store | null }
  | {
      type: "SET_WEEKLY_PLAN_MEAL";
      payload: {
        day: string;
        mealType: "breakfast" | "lunch" | "dinner";
        recipe?: Recipe;
      };
    }
  | { type: "SET_MONTHLY_BUDGET_TARGET"; payload: number }
  | { type: "ADD_EXTRA_EXPENSE"; payload: number }
  | { type: "SET_USER"; payload: UserProfile | null };

// ─────────────────────────────────────────────────────────────
// Initial State
// ─────────────────────────────────────────────────────────────

export const initialState: AppState = {
  userBudget: 50000, // 50,000 VND default budget (Sinh viên 50k)
  monthlyBudgetTarget: 1500000, // 1.5tr VND default for student
  extraExpenses: 0,
  servings: 2, // Default 2 people
  cart: [],
  pantryIngredients: [],
  selectedStore: null,
  weeklyPlan: {},
  user: null,
};

// ─────────────────────────────────────────────────────────────
// Reducer
// ─────────────────────────────────────────────────────────────

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "RESTORE":
      return { ...state, ...action.payload, user: state.user };
    case "SET_BUDGET":
      return { ...state, userBudget: action.payload };

    case "SET_SERVINGS":
      return { ...state, servings: action.payload };

    case "ADD_TO_CART": {
      const itemStore = action.payload.ingredient.store;
      const isDifferentStore =
        state.selectedStore !== null && state.selectedStore !== itemStore;
      const baseCart = state.cart;

      const existing = baseCart.find(
        (item) => item.ingredient.id === action.payload.ingredient.id,
      );
      if (existing) {
        return {
          ...state,
          selectedStore: isDifferentStore ? null : itemStore,
          cart: baseCart.map((item) =>
            item.ingredient.id === action.payload.ingredient.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item,
          ),
        };
      }
      return {
        ...state,
        selectedStore: isDifferentStore ? null : itemStore,
        cart: [...baseCart, action.payload],
      };
    }

    case "ADD_MULTIPLE_TO_CART": {
      // Dùng logic gộp item đơn giản
      const newCart = [...state.cart];

      for (const payloadItem of action.payload) {
        const existingIndex = newCart.findIndex(
          (item) => item.ingredient.id === payloadItem.ingredient.id,
        );

        if (existingIndex >= 0) {
          newCart[existingIndex] = {
            ...newCart[existingIndex],
            quantity: newCart[existingIndex].quantity + payloadItem.quantity,
          };
        } else {
          newCart.push(payloadItem);
        }
      }

      const stores = new Set(newCart.map((item) => item.ingredient.store));
      return {
        ...state,
        selectedStore: stores.size === 1 ? newCart[0].ingredient.store : null,
        cart: newCart,
      };
    }

    case "REMOVE_FROM_CART": {
      const remainingCart = state.cart.filter(
        (item) => item.ingredient.id !== action.payload,
      );
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
            : item,
        ),
      };

    case "CLEAR_CART":
      return { ...state, cart: [], selectedStore: null };

    case "SET_WEEKLY_PLAN_MEAL": {
      const { day, mealType, recipe } = action.payload;
      return {
        ...state,
        weeklyPlan: {
          ...state.weeklyPlan,
          [day]: {
            ...state.weeklyPlan[day],
            [mealType]: recipe,
          },
        },
      };
    }

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
          (ing) => ing !== action.payload,
        ),
      };

    case "SET_PANTRY_INGREDIENTS":
      return { ...state, pantryIngredients: action.payload };

    case "SET_MONTHLY_BUDGET_TARGET":
      return { ...state, monthlyBudgetTarget: action.payload };

    case "ADD_EXTRA_EXPENSE":
      return { ...state, extraExpenses: state.extraExpenses + action.payload };

    case "SET_USER":
      return {
        ...(state.user?.id === action.payload?.id && action.payload
          ? state
          : initialState),
        user: action.payload,
        monthlyBudgetTarget:
          action.payload?.monthlyBudgetTarget ??
          initialState.monthlyBudgetTarget,
      };

    default:
      return state;
  }
}

// ─────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────

interface AppContextValue {
  authReady: boolean;
  state: AppState;

  // Budget & Servings
  setBudget: (budget: number) => void;
  setServings: (servings: number) => void;

  // Cart
  addToCart: (item: CartItem) => void;
  addMultipleToCart: (items: CartItem[]) => void;
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

  // Monthly Budget
  setMonthlyBudgetTarget: (target: number) => void;
  addExtraExpense: (expense: number) => void;
  remainingMonthlyBudget: number;
  suggestedDailyBudget: number;

  // Weekly Plan
  setWeeklyPlanMeal: (
    day: string,
    mealType: "breakfast" | "lunch" | "dinner",
    recipe?: Recipe,
  ) => void;

  // User Auth
  setUser: (user: UserProfile | null) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

// ─────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────

function readSavedState(userId: string): Partial<AppState> {
  try {
    const saved = JSON.parse(
      localStorage.getItem("grocery:" + userId) || "null",
    );
    if (!saved || !Array.isArray(saved.cart)) return {};
    const cart = saved.cart.filter(
      (item: CartItem) =>
        item?.ingredient &&
        typeof item.ingredient.id === "string" &&
        typeof item.ingredient.name === "string" &&
        Number.isFinite(item.ingredient.price) &&
        item.ingredient.price >= 0 &&
        Number.isFinite(item.ingredient.quantity) &&
        item.ingredient.quantity > 0 &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0 &&
        item.quantity <= 100000,
    );
    return {
      cart,
      userBudget:
        Number.isFinite(saved.userBudget) && saved.userBudget > 0
          ? saved.userBudget
          : 50000,
      servings:
        Number.isInteger(saved.servings) &&
        saved.servings > 0 &&
        saved.servings <= 20
          ? saved.servings
          : 2,
    };
  } catch {
    return {};
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    let active = true;
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((data) => {
        if (!active) return;
        dispatch({ type: "SET_USER", payload: data.user ?? null });
        if (data.user?.id)
          dispatch({ type: "RESTORE", payload: readSavedState(data.user.id) });
      })
      .catch(() => {})
      .finally(() => {
        if (active) setAuthReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!authReady || !state.user?.id) return;
    try {
      localStorage.setItem(
        "grocery:" + state.user.id,
        JSON.stringify({
          cart: state.cart,
          userBudget: state.userBudget,
          servings: state.servings,
        }),
      );
    } catch {
      /* Storage can be unavailable in private browsing. */
    }
  }, [state.cart, state.userBudget, state.servings, state.user?.id, authReady]);

  // ── Budget & Servings ──
  const setBudget = useCallback((budget: number) => {
    dispatch({ type: "SET_BUDGET", payload: budget });
  }, []);

  const setServings = useCallback((servings: number) => {
    dispatch({ type: "SET_SERVINGS", payload: servings });
  }, []);

  // ── Cart ──
  const addToCart = useCallback((item: CartItem) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  }, []);

  const addMultipleToCart = useCallback((items: CartItem[]) => {
    dispatch({ type: "ADD_MULTIPLE_TO_CART", payload: items });
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
    [],
  );

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  const cartTotal = state.cart.reduce(
    (sum, item) => sum + item.ingredient.price * item.quantity,
    0,
  );

  const cartItemCount = state.cart.reduce((count) => count + 1, 0);

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
        (p) => p.toLowerCase() === ingredientName.toLowerCase(),
      ),
    [state.pantryIngredients],
  );

  const setWeeklyPlanMeal = useCallback(
    (
      day: string,
      mealType: "breakfast" | "lunch" | "dinner",
      recipe?: Recipe,
    ) => {
      dispatch({
        type: "SET_WEEKLY_PLAN_MEAL",
        payload: { day, mealType, recipe },
      });
    },
    [],
  );

  // ── Budget Helpers ──
  const remainingBudget = state.userBudget - cartTotal;
  const budgetUsagePercent =
    state.userBudget > 0
      ? Math.min((cartTotal / state.userBudget) * 100, 100)
      : 0;
  const isOverBudget = cartTotal > state.userBudget;

  const setMonthlyBudgetTarget = useCallback((target: number) => {
    dispatch({ type: "SET_MONTHLY_BUDGET_TARGET", payload: target });
  }, []);

  const addExtraExpense = useCallback((expense: number) => {
    dispatch({ type: "ADD_EXTRA_EXPENSE", payload: expense });
  }, []);

  const setUser = useCallback((user: UserProfile | null) => {
    dispatch({ type: "SET_USER", payload: user });
    if (user?.id)
      dispatch({ type: "RESTORE", payload: readSavedState(user.id) });
  }, []);

  const remainingMonthlyBudget =
    state.monthlyBudgetTarget - state.extraExpenses;
  const suggestedDailyBudget =
    remainingMonthlyBudget > 0 ? Math.floor(remainingMonthlyBudget / 30) : 0;

  const value: AppContextValue = {
    authReady,
    state,
    setBudget,
    setServings,
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
    setMonthlyBudgetTarget,
    addExtraExpense,
    remainingMonthlyBudget,
    suggestedDailyBudget,
    setWeeklyPlanMeal,
    addMultipleToCart,
    setUser,
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
