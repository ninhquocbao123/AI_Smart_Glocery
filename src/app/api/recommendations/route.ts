import { readCatalog } from "@/lib/server/catalog-data";
import { type Recipe } from "@/data/mockData";
import { recommend, recipeCost } from "@/lib/recommendations";
import { validateRanking } from "@/lib/ai-result";
import { Offer } from "@/models/Commerce";
import {
  ApiError,
  body,
  fail,
  integer,
  rateLimit,
  sameOrigin,
  userRequired,
} from "@/lib/server/http";
import { isLive } from "@/lib/server/config";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const user = await userRequired();
    await rateLimit("recommend:" + user._id, 12);
    const data = await body(req);
    const budget = integer(data.budget, 1000, 50000000),
      servings = integer(data.servings, 1, 20);
    const { recipes } = await readCatalog();
    let catalog: Recipe[] = recipes;
    if (isLive()) {
      if (typeof data.store !== "string")
        throw new ApiError(400, "Chọn cửa hàng để tính giá nguyên liệu.");
      const offers = await Offer.find({
        store: data.store,
        active: true,
        validUntil: { $gt: new Date() },
      }).lean();
      catalog = recipes.flatMap((r) => {
        const ingredients = r.ingredients.map((i) => {
          const offer = offers.find(
            (o) =>
              o.ingredientId === i.id &&
              o.unit === i.unit &&
              o.stock >= Math.ceil((i.quantity * servings) / r.servings),
          );
          return offer ? { ...i, price: Number(offer.price) } : null;
        });
        return ingredients.every((i) => i !== null)
          ? [{ ...r, ingredients: ingredients as Recipe["ingredients"] }]
          : [];
      });
    }
    const candidates = recommend(
      budget,
      servings,
      user.diet,
      user.allergies,
      catalog,
    ).slice(0, 20);
    let ordered = candidates;
    let source = "rules",
      message = "Gợi ý theo công thức và ngân sách; AI chưa được cấu hình.";
    if (!candidates.length)
      message = isLive()
        ? "Chưa đủ giá/tồn kho hiện hành để gợi ý món tại cửa hàng này."
        : "Chưa có món phù hợp ngân sách và khẩu vị.";
    if (
      candidates.length &&
      process.env.GEMINI_API_KEY &&
      process.env.GEMINI_MODEL
    ) {
      try {
        await rateLimit("ai-day:" + user._id, 30, 86400000);
        await rateLimit("ai-global-day", 1000, 86400000);
        const model = process.env.GEMINI_MODEL;
        if (!/^[a-zA-Z0-9.-]+$/.test(model)) throw Error("Invalid model");
        // Personal profile remains local. Send only pre-filtered recipes, serving count and budget.
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": process.env.GEMINI_API_KEY,
            },
            signal: AbortSignal.timeout(20000),
            cache: "no-store",
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text:
                        "Xếp hạng các món Việt sau cho bữa ăn hằng ngày. Chỉ trả mã món có sẵn, ưu tiên dễ nấu, tiết kiệm và đa dạng. " +
                        JSON.stringify({
                          budget,
                          servings,
                          recipes: candidates.map((r) => ({
                            id: r.id,
                            title: r.title,
                            cost: recipeCost(r, servings),
                            minutes: r.prepTime + r.cookTime,
                          })),
                        }),
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 2048,
                responseMimeType: "application/json",
                responseSchema: {
                  type: "OBJECT",
                  properties: {
                    recipeIds: { type: "ARRAY", items: { type: "STRING" } },
                  },
                  required: ["recipeIds"],
                },
              },
            }),
          },
        );
        if (!response.ok) throw Error("AI unavailable");
        const result = await response.json();
        const output = result.candidates?.[0]?.content?.parts
          ?.map((p: { text?: string }) => p.text ?? "")
          .join("");
        const ids = validateRanking(
          JSON.parse(output),
          candidates.map((r) => r.id),
        );
        ordered = [
          ...ids.map((id) => candidates.find((r) => r.id === id)!),
          ...candidates.filter((r) => !ids.includes(r.id)),
        ];
        source = "gemini";
        message =
          "AI sắp xếp món phù hợp; backend đã kiểm tra ngân sách và nguyên liệu.";
      } catch {
        message =
          "AI tạm thời không khả dụng hoặc đã hết hạn mức. Đang dùng bộ gợi ý theo ngân sách.";
      }
    }
    return Response.json({
      recipes: ordered,
      source,
      message,
      priceSource: isLive() ? "managed-catalog" : "reference",
      costs: Object.fromEntries(
        ordered.map((r) => [r.id, recipeCost(r, servings)]),
      ),
    });
  } catch (e) {
    return fail(e);
  }
}
