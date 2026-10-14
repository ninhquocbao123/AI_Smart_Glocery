"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, Minus, Plus } from "lucide-react";
import { Recipe, Ingredient } from "@/data/mockData";

interface IngredientModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export default function IngredientModal({ recipe, onClose }: IngredientModalProps) {
  // Group ingredients into "Main" and "Spices"
  const spiceCategories = ["Gia vị", "Nước sốt", "Dầu ăn"];
  const mainIngredients = recipe.ingredients.filter(i => !spiceCategories.includes(i.category));
  const spices = recipe.ingredients.filter(i => spiceCategories.includes(i.category));

  // Local state for selected ingredients and quantities
  const [selectedMains, setSelectedMains] = useState<Record<string, boolean>>(
    mainIngredients.reduce((acc, i) => ({ ...acc, [i.id]: true }), {})
  );
  const [spiceQuantities, setSpiceQuantities] = useState<Record<string, number>>(
    spices.reduce((acc, i) => ({ ...acc, [i.id]: 0 }), {}) // default to 0 for extra spices
  );

  const toggleMain = (id: string) => {
    setSelectedMains(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const updateSpice = (id: string, delta: number) => {
    setSpiceQuantities(prev => ({
      ...prev,
      [id]: Math.max(0, prev[id] + delta)
    }));
  };

  // Calculate total
  const totalPrice = mainIngredients.reduce((sum, i) => sum + (selectedMains[i.id] ? i.price * i.quantity : 0), 0)
                   + spices.reduce((sum, i) => sum + (spiceQuantities[i.id] * i.price * i.quantity), 0);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full sm:max-w-md bg-surface sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden flex flex-col h-[85vh] sm:h-[80vh]"
        >
          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between p-4 border-b border-outline-variant bg-surface-container-highest">
            <h2 className="font-bold text-base text-on-surface">Nguyên liệu món {recipe.title}</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* View instructions link */}
            <div className="flex items-center gap-3 bg-surface-container p-3 rounded-xl cursor-pointer hover:bg-surface-container-high transition-colors">
              <img src={recipe.image} alt="recipe" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1 text-sm font-medium text-on-surface">Xem hướng dẫn chế biến</div>
              <ChevronRight className="w-5 h-5 text-primary" />
            </div>

            {/* Main Ingredients */}
            {mainIngredients.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-3 text-on-surface">Lựa chọn loại nguyên liệu chính</h3>
                <div className="grid grid-cols-2 gap-3">
                  {mainIngredients.map(ing => (
                    <div key={ing.id} className="border border-outline-variant rounded-xl p-2 flex flex-col bg-surface">
                      <img src={ing.image} alt={ing.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                      <div className="text-xs font-medium line-clamp-2 min-h-[32px] text-on-surface">{ing.name}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="font-bold text-sm text-on-surface">{(ing.price * ing.quantity).toLocaleString()}đ</span>
                        <span className="text-[10px] text-error bg-error-container px-1 py-0.5 rounded font-bold">
                          -10%
                        </span>
                      </div>
                      <div className="text-[10px] text-on-surface-variant line-through mt-0.5">
                        {((ing.price * ing.quantity) * 1.1).toLocaleString()}đ
                      </div>
                      <button
                        onClick={() => toggleMain(ing.id)}
                        className={`mt-2 py-1.5 text-xs font-bold rounded-lg transition-colors w-full border ${
                          selectedMains[ing.id]
                            ? "bg-primary text-on-primary border-primary hover:bg-primary-dark"
                            : "bg-surface text-primary border-primary hover:bg-primary-container"
                        }`}
                      >
                        {selectedMains[ing.id] ? "ĐÃ CHỌN" : "MUA"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extra Spices */}
            {spices.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-3 text-on-surface">Mua thêm gia vị</h3>
                <div className="grid grid-cols-2 gap-3">
                  {spices.map(ing => (
                    <div key={ing.id} className="border border-outline-variant rounded-xl p-2 flex flex-col bg-surface">
                      <img src={ing.image} alt={ing.name} className="w-full h-24 object-cover rounded-lg mb-2" />
                      <div className="text-xs font-medium line-clamp-2 min-h-[32px] text-on-surface">{ing.name}</div>
                      <div className="font-bold text-sm mt-1 text-on-surface">{(ing.price * ing.quantity).toLocaleString()}đ</div>
                      
                      {spiceQuantities[ing.id] > 0 ? (
                        <div className="mt-2 flex items-center justify-between bg-surface-container rounded-lg px-2 py-1 border border-outline-variant">
                          <button onClick={() => updateSpice(ing.id, -1)} className="p-1 text-on-surface hover:text-primary transition-colors">
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm font-bold text-on-surface">{spiceQuantities[ing.id]}</span>
                          <button onClick={() => updateSpice(ing.id, 1)} className="p-1 text-on-surface hover:text-primary transition-colors">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => updateSpice(ing.id, 1)}
                          className="mt-2 py-1.5 bg-surface text-primary border border-primary text-xs font-bold rounded-lg transition-colors hover:bg-primary-container w-full"
                        >
                          MUA
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-outline-variant bg-surface flex-shrink-0">
            <button className="w-full btn-filled py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm">
              THÊM VÀO GIỎ ({totalPrice.toLocaleString()}đ)
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
