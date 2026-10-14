export function validateRanking(
  value: unknown,
  allowedIds: string[],
): string[] {
  if (
    !value ||
    typeof value !== "object" ||
    !("recipeIds" in value) ||
    !Array.isArray(value.recipeIds)
  )
    throw new Error("Invalid AI response");
  const ids = value.recipeIds;
  if (
    !ids.length ||
    ids.length > allowedIds.length ||
    ids.some((id) => typeof id !== "string" || !allowedIds.includes(id)) ||
    new Set(ids).size !== ids.length
  )
    throw new Error("AI returned unknown or duplicate recipe IDs");
  return ids;
}
