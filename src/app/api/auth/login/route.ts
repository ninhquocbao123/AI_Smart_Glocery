import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { createSession } from "@/lib/session";
import bcrypt from "bcryptjs";
import { body, fail, rateLimit, sameOrigin } from "@/lib/server/http";

export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const { email, password } = await body(req);

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email ||
      !password || email.length > 254 || Buffer.byteLength(password) > 72
    ) {
      return NextResponse.json(
        { message: "Vui lòng nhập email và mật khẩu." },
        { status: 400 },
      );
    }

    await dbConnect();
    await rateLimit("login:" + email.toLowerCase().trim(), 10, 900000);

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { message: "Email hoặc mật khẩu không đúng." },
        { status: 401 },
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Email hoặc mật khẩu không đúng." },
        { status: 401 },
      );
    }

    await createSession(user._id.toString());
    return NextResponse.json(
      {
        message: "Đăng nhập thành công.",
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          diet: user.diet,
          allergies: user.allergies,
          monthlyBudgetTarget: user.monthlyBudgetTarget,
          memberTier: user.memberTier,
          joinYear: user.joinYear,
          points: user.points,
          orders: user.orders,
        },
      },
      { status: 200 },
    );
  } catch (e) {
    return fail(e);
  }
}
