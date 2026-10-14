"use client";
import { useEffect, useState } from "react";
import { recipes as initialRecipes, type Recipe } from "@/data/mockData";

export function useCatalogRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/recipes", { signal: controller.signal, cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Catalog unavailable");
        const data = await response.json();
        if (Array.isArray(data.recipes)) setRecipes(data.recipes);
      })
      .catch(() => { /* Bundled demo catalog remains available offline. */ });
    return () => controller.abort();
  }, []);
  return recipes;
}
