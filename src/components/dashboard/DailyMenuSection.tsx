"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Recipe, recipes } from "@/data/mockData";
import IngredientModal from "./IngredientModal";

const CATEGORIES = [
  { id: "mon_man", label: "Món mặn", tags: ["thịt heo", "thịt bò", "thịt gà", "nướng", "truyền thống", "bữa tối"] },
  { id: "xao_luoc", label: "Xào, luộc", tags: ["nhanh gọn", "rau xanh", "thanh mát"] },
  { id: "mon_canh", label: "Món canh", tags: ["súp", "canh chua"] },
  { id: "rau_song", label: "Rau sống", tags: ["khai vị", "sức khỏe"] },
  { id: "trai_cay", label: "Trái Cây", tags: ["trái cây", "ăn vặt", "đồ uống"] },
];

export default function DailyMenuSection() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const activeCategoryData = CATEGORIES.find(c => c.id === activeCategory);
  
  // Filter recipes based on category tags
  const filteredRecipes = recipes.filter(r => 
    r.tags.some(tag => activeCategoryData?.tags.includes(tag))
  ).slice(0, 10);

  // If no recipes match, just show some random ones for demo purposes
  const displayRecipes = filteredRecipes.length > 0 ? filteredRecipes : recipes.slice(0, 10);

  return (
    <section className="mb-8 sm:mb-10 bg-surface rounded-2xl p-4 sm:p-6 shadow-sm border border-outline-variant/50">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-5">
        <h2 className="text-xl font-bold text-primary uppercase tracking-tight">Hôm nay ăn gì?</h2>
        <span className="text-xs font-medium text-secondary bg-secondary-container px-2 py-0.5 rounded-full self-start sm:self-auto flex items-center gap-1">
          ✨ Gợi ý từ nguyên liệu bạn đang có
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-2 snap-x">
        {CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={`snap-start whitespace-nowrap px-4 py-1.5 rounded-full font-bold text-sm transition-all duration-200 ${
              activeCategory === category.id 
                ? "bg-primary text-on-primary shadow-sm" 
                : "bg-surface text-on-surface-variant border border-outline-variant hover:bg-surface-container"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Horizontal List of Dishes */}
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {displayRecipes.map(recipe => (
          <div 
            key={recipe.id} 
            className="min-w-[150px] sm:min-w-[180px] max-w-[180px] snap-start bg-surface rounded-xl border border-outline-variant overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => setSelectedRecipe(recipe)}
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-2 left-2 right-2 text-white text-sm font-bold line-clamp-2 leading-tight drop-shadow-md">
                {recipe.title}
              </div>
            </div>
            <div className="p-2 sm:p-3 flex flex-col flex-grow bg-surface-container-lowest">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRecipe(recipe);
                }}
                className="w-full mt-auto py-2 bg-primary-container text-on-primary-container text-xs font-bold rounded-lg hover:bg-primary hover:text-on-primary transition-colors border border-transparent hover:border-primary-dark"
              >
                MUA NGUYÊN LIỆU
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ingredient Modal */}
      {selectedRecipe && (
        <IngredientModal 
          recipe={selectedRecipe} 
          onClose={() => setSelectedRecipe(null)} 
        />
      )}
    </section>
  );
}
