import { recipes, type Recipe } from "@/data/mockData";
export function recipeCost(recipe: Recipe, servings: number) {
  return Math.ceil(
    recipe.ingredients.reduce(
      (s, i) =>
        s + i.price * Math.ceil((i.quantity * servings) / recipe.servings),
      0,
    ),
  );
}
export function recommend(
  budget: number,
  servings: number,
  diet = "Không hạn chế",
  allergies: string[] = [],
  catalog: Recipe[] = recipes,
) {
  const avoid: Record<string, string[]> = {
    "Hải sản": [
      "tôm",
      "cua",
      "cá",
      "mực",
      "nghêu",
      "sò",
      "hàu",
      "nước mắm",
      "mắm",
    ],
    "Đậu phộng": ["đậu phộng", "lạc"],
    Trứng: ["trứng"],
    Sữa: ["sữa", "phô mai", "bơ lạt"],
  };
  return catalog
    .filter((r) => {
      const names = r.ingredients.map((i) => i.name.toLowerCase()).join(" ");
      if (
        diet === "Ăn chay" &&
        [
          "thịt",
          "sườn",
          "bò",
          "heo",
          "gà",
          "vịt",
          "tôm",
          "cá",
          "mực",
          "mắm",
          "xương",
          "bì",
          "chả",
          "giò",
          "hải sản",
        ].some((k) => names.includes(k))
      )
        return false;
      if (
        diet === "Ít tinh bột" &&
        r.ingredients.some((i) => i.category === "Tinh bột")
      )
        return false;
      return (
        recipeCost(r, servings) <= budget &&
        !allergies.some((a) =>
          (avoid[a] ?? [a.toLowerCase()]).some((k) => names.includes(k)),
        )
      );
    })
    .sort((a, b) => recipeCost(a, servings) - recipeCost(b, servings));
}
