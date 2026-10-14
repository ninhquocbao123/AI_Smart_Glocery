import { isAdminUser } from "@/lib/server/roles";
import { currentUser } from "@/lib/session";
export async function PATCH(req: Request) {
  try {
    const user = await currentUser();
    if (!user)
      return Response.json({ message: "Vui lòng đăng nhập." }, { status: 401 });
    const data = await req.json();
    if (
      typeof data.name !== "string" ||
      !data.name.trim() ||
      data.name.length > 100 ||
      typeof data.phone !== "string" ||
      !/^[\d+ ()-]{0,20}$/.test(data.phone) ||
      typeof data.address !== "string" ||
      data.address.length > 300 ||
      !["Không hạn chế", "Ăn chay", "Ít tinh bột"].includes(data.diet) ||
      !Array.isArray(data.allergies) ||
      data.allergies.some(
        (a: unknown) => typeof a !== "string" || a.length > 50,
      ) ||
      !Number.isFinite(data.monthlyBudgetTarget) ||
      data.monthlyBudgetTarget <= 0 ||
      data.monthlyBudgetTarget > 1000000000
    )
      return Response.json(
        { message: "Vui lòng kiểm tra thông tin và ngân sách." },
        { status: 400 },
      );
    Object.assign(user, {
      name: data.name.trim(),
      phone: data.phone.trim(),
      address: data.address.trim(),
      diet: data.diet,
      allergies: data.allergies,
      monthlyBudgetTarget: data.monthlyBudgetTarget,
    });
    await user.save();
    return Response.json({
      user: { ...user.toObject(), id: String(user._id), isAdmin: isAdminUser(user) },
    });
  } catch {
    return Response.json(
      { message: "Không thể lưu hồ sơ. Vui lòng thử lại." },
      { status: 503 },
    );
  }
}
