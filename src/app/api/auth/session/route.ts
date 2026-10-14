import { isAdminUser } from "@/lib/server/roles";
import { currentUser, deleteSession } from "@/lib/session";
export async function GET() {
  try {
    const user = await currentUser();
    return Response.json({
      user: user ? { ...user.toObject(), id: String(user._id), isAdmin: isAdminUser(user) } : null,
    });
  } catch {
    return Response.json(
      { message: "Không thể kết nối cơ sở dữ liệu. Vui lòng thử lại." },
      { status: 503 },
    );
  }
}
export async function DELETE() {
  try {
    await deleteSession();
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { message: "Không thể đăng xuất. Vui lòng thử lại." },
      { status: 503 },
    );
  }
}
