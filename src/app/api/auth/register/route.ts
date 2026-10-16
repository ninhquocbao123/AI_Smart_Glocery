import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { body, fail, rateLimit, sameOrigin } from "@/lib/server/http";

export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const data = await body(req);
    const { name, password, confirmPassword } = data;
    const phone = typeof data.phone === "string" ? data.phone.replace(/[\s().-]/g, "") : "";
    const address = typeof data.address === "string" ? data.address.trim() : "";
    const email =
      typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.length > 100 ||
      email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof password !== "string" ||
      password.length < 8 ||
      Buffer.byteLength(password) > 72
    ) {
      return NextResponse.json(
        {
          message:
            "Nhập tên, email hợp lệ và mật khẩu từ 8 ký tự, tối đa 72 byte.",
        },
        { status: 400 },
      );
    }

    if (confirmPassword !== password) return NextResponse.json({ message: "Mật khẩu xác nhận không khớp." }, { status: 400 });
    if (!/^(?:0\d{9}|\+84\d{9})$/.test(phone) || address.length < 10 || address.length > 300) return NextResponse.json({ message: "Nhập số điện thoại Việt Nam hợp lệ và địa chỉ từ 10–300 ký tự." }, { status: 400 });

    await dbConnect();
    await rateLimit("register:" + (req.headers.get("x-vercel-forwarded-for") ?? req.headers.get("x-forwarded-for") ?? "local"), 5, 3600000);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email này đã được sử dụng." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name.trim(),
      email,
      phone, address,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json(
      {
        message: "Đăng ký thành công.",
        user: { name: newUser.name, email: newUser.email },
      },
      { status: 201 },
    );
  } catch (e) {
    return fail(e);
  }
}
