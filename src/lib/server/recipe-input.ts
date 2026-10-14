import { randomUUID } from 'node:crypto';
import type { Recipe, Store } from '@/data/mockData';
import { ApiError, integer, stringValue } from './http';

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new ApiError(400, 'Dữ liệu món ăn không hợp lệ.');
  return value as Record<string, unknown>;
}
function list(value: unknown, min = 0, max = 40): unknown[] {
  if (!Array.isArray(value) || value.length < min || value.length > max) throw new ApiError(400, 'Kiểm tra lại danh sách nguyên liệu hoặc bước nấu.');
  return value;
}
function amount(value: unknown) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0 || value > 100000) throw new ApiError(400, 'Định lượng phải lớn hơn 0.');
  return value;
}
export function recipeInput(input: Record<string, unknown>, id: string, existing?: Recipe): Recipe {
  const image = stringValue(input.image, 1, 200);
  if (!/^\/(?:api\/images\/[a-f0-9-]{36}|images\/food\/[a-zA-Z0-9_-]+\.webp)$/.test(image)) throw new ApiError(400, 'Vui lòng tải ảnh món ăn lên.');
  const servings = integer(input.servings, 1, 20);
  const difficulty = stringValue(input.difficulty);
  if (!['Dễ', 'Trung bình', 'Khó'].includes(difficulty)) throw new ApiError(400, 'Độ khó không hợp lệ.');
  const used = new Set<string>();
  const ingredients = list(input.ingredients, 1).map(value => {
    const row = object(value);
    const ingredientId = typeof row.id === 'string' && existing?.ingredients.some(i => i.id === row.id) ? row.id : `${id}-${randomUUID()}`;
    if (used.has(ingredientId)) throw new ApiError(400, 'Nguyên liệu bị trùng.');
    used.add(ingredientId);
    const store = stringValue(row.store);
    if (!['Bach Hoa Xanh', 'Winmart', 'Coop Food'].includes(store)) throw new ApiError(400, 'Cửa hàng không hợp lệ.');
    return { id: ingredientId, name: stringValue(row.name, 1, 120), price: integer(row.price, 1, 10000000), quantity: integer(row.quantity, 1, 100000), unit: stringValue(row.unit, 1, 40), store: store as Store, category: stringValue(row.category, 1, 60), image: existing?.ingredients.find(i => i.id === ingredientId)?.image || image };
  });
  const guide = object(input.cookingGuide);
  const steps = list(guide.steps, 1, 30).map(value => {
    const row = object(value);
    return { title: stringValue(row.title, 1, 160), duration: stringValue(row.duration, 1, 80), heat: stringValue(row.heat, 1, 100), detail: stringValue(row.detail, 10, 2500), cue: stringValue(row.cue, 1, 600) };
  });
  const measures = list(guide.measures, 1);
  if (measures.length !== ingredients.length) throw new ApiError(400, 'Mỗi nguyên liệu cần một định lượng nấu.');
  const totalPrice = ingredients.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (totalPrice > 100000000) throw new ApiError(400, 'Tổng chi phí quá lớn.');
  return {
    id, title: stringValue(input.title, 2, 160), description: stringValue(input.description, 10, 1500), image,
    cuisine: 'Việt Nam', difficulty: difficulty as Recipe['difficulty'], servings,
    prepTime: integer(input.prepTime, 0, 1440), cookTime: integer(input.cookTime, 0, 1440),
    active: existing?.active !== false, ingredients, totalPrice,
    tags: list(input.tags).map(t => stringValue(t, 1, 60)), instructions: steps.map(s => s.detail),
    cookingGuide: { baseServings: servings, steps,
      measures: measures.map((value, index) => { const m = object(value); return { ingredientId: ingredients[index].id, name: ingredients[index].name, quantity: amount(m.quantity), unit: stringValue(m.unit, 1, 40) }; }),
      pantry: list(guide.pantry).map(value => { const m = object(value); return { name: stringValue(m.name, 1, 100), quantity: amount(m.quantity), unit: stringValue(m.unit, 1, 40) }; }),
      equipment: list(guide.equipment).map(v => stringValue(v, 1, 100)), waiting: stringValue(guide.waiting, 0, 500), finish: stringValue(guide.finish, 1, 1000),
    },
  };
}
