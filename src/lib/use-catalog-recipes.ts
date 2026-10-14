"use client";
import { useEffect, useState } from "react";
import { type Recipe } from "@/data/mockData";

export function useCatalogState() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/recipes", { signal: controller.signal, cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Catalog unavailable");
        const data = await response.json();
        if (Array.isArray(data.recipes)) setRecipes(data.recipes);
      })
      .catch(() => { if (!controller.signal.aborted) setError(true); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);
  return { recipes, loading, error };
}

export function useCatalogRecipes() { return useCatalogState().recipes; }
