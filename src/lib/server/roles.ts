export function isAdminUser(user: { _id?: unknown; role?: string } | null) {
  if (!user) return false;
  return user.role === "admin" || (process.env.ADMIN_USER_IDS ?? "").split(",").map(x => x.trim()).filter(Boolean).includes(String(user._id));
}
