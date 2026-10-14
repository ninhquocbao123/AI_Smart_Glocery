"use client";
import { useEffect, useState } from "react";
import type { Recipe } from "@/data/mockData";
export function useRecommendations(
  budget: number,
  servings: number,
  store: string,
  enabled = true,
) {
  const key = JSON.stringify({ budget, servings, store });
  const [result, setResult] = useState<{
    key: string;
    recipes: Recipe[];
    message: string;
    source: string;
    priceSource: string;
    error: string;
  } | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    fetch("/api/recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ budget, servings, store }),
      signal: controller.signal,
    })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw Error(d.message);
        if (!controller.signal.aborted) setResult({ ...d, key, error: "" });
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setResult({
            key,
            recipes: [],
            message: "",
            source: "",
            priceSource: "",
            error: e.message,
          });
      });
    return () => controller.abort();
  }, [budget, servings, store, enabled, key]);
  return {
    ...(result?.key === key
      ? result
      : { recipes: [], message: "", source: "", priceSource: "", error: "" }),
    loading: enabled && result?.key !== key,
  };
}
