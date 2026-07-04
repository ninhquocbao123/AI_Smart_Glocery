# SmartCart AI - Project Handover Document (Post-Task 4)

This document summarizes the progress, architecture, and current state of the "SmartCart AI" project to help transition the context to another AI assistant.

## 1. Project Overview & Tech Stack
- **App Name:** SmartCart AI (Grocery Intelligence)
- **Framework:** Next.js (App Router), React
- **Styling:** Tailwind CSS (v4), Framer Motion (for animations)
- **Icons:** Lucide React
- **State Management:** React Context API + `useReducer` (`src/context/AppContext.tsx`)
- **Design Philosophy:** Material Design 3 aesthetic, vibrant, accessible, modern cards.
- **Colors:** Primary Green (`#1B7A3D`), Secondary Orange (`#F57C00`).

## 2. Completed Work

### Task 1: Project Setup & Mock Data
- Initialized Next.js project.
- Configured global state (`AppContext`) to manage: `userBudget`, `cart`, `pantryIngredients`.
- Created robust mock data (`src/data/mockData.ts`) containing:
  - 10 distinct recipes with varying prices, prep times, and ingredients.
  - Ingredients mapped to 3 specific stores ('Bach Hoa Xanh', 'Winmart', 'Coop Food') with category tags.
- Implemented price utility functions (`src/lib/priceUtils.ts`) for deterministic price variations across stores based on string hashing.

### Task 2: Screen 1 - Dashboard
- Built `src/app/page.tsx` (Home/Dashboard).
- Includes a Hero section, Budget Input Card (saves to global state), and scrollable carousels for "Daily Meal Plan" and "Trending Budget Recipes".

### Task 3: Screen 2 (Meal Plan) & Screen 3 (Recipe Detail)
- **Screen 2 (`src/app/meal-plan/page.tsx`):** AI Recipe Suggestions grid. Reads `userBudget` to filter/highlight recipes fitting the budget. Includes animated cards.
- **Screen 3 (`src/app/meal-plan/[id]/page.tsx`):** Recipe Detail page.
  - Smart Ingredient List: Compares recipe ingredients against global `pantryIngredients` to show what's needed vs. what's available.
  - Price Optimizer: Tabs to compare ingredient prices across different stores.
  - "Add missing ingredients to Cart" button dispatches items to global cart.
- **Image Handling:** Generated real AI food photography for the first 6 recipes. Created a smart `RecipeImage` component (`src/components/ui/RecipeImage.tsx`) that displays the real image if available, or a deterministic gradient + emoji fallback for missing images.

### Task 4: Screen 4 - Integrated Shopping Cart (Grocery Store)
- Built `src/app/grocery-store/page.tsx` reading from the global `cart` state.
- **Features implemented:**
  - Items are visually grouped by store (Bach Hoa Xanh, Winmart, Coop Food) into distinct cards.
  - **Consolidate Order Toggle:** UI switch at the top to simulate grouping orders to save shipping fees, dynamically applying a simulated 3% discount to the grand total.
  - **Budget Progress Bar:** A dynamic progress bar comparing the Total Cart Value against `userBudget`. It visually turns red and displays warnings if the budget is exceeded.
  - Quantity controls (+/-) and remove item functionality.
  - Order Summary section and AI Shopping Tips.
  - **Proceed to Checkout Button:** (Currently marked as "Mark All as Bought") designed to finalize the flow.

## 3. Global State Structure (`AppContext.tsx`)
- `state.userBudget` (number)
- `state.cart` (array of `CartItem`: `{ ingredient, quantity, recipeId, recipeTitle }`)
- `state.pantryIngredients` (array of strings)
- Actions available: `setBudget`, `addToCart`, `removeFromCart`, `updateCartQuantity`, `clearCart`, `addPantryIngredient`, `removePantryIngredient`, `setPantryIngredients`.

## 4. Pending / Next Steps (Task 5)
- **Task 5 (Screen 5 - Profile/Pantry):** Build the Profile/Pantry Management screen (`src/app/profile/page.tsx`).
- Needs to read/write to `pantryIngredients` in the global state.
- Will allow the user to manually add/remove items they already have at home, which directly affects the "Smart Ingredient List" logic in Screen 3.

## 5. Notes for Next AI
- The app uses standard CSS classes defined in `src/app/globals.css` (e.g., `.card-outlined`, `.btn-filled`, `.gradient-primary`) to maintain MD3 styling consistency.
- Always use `formatVND` from `src/lib/priceUtils.ts` when displaying prices.
- When adding new features, ensure they integrate smoothly with Framer Motion for premium UI transitions.
