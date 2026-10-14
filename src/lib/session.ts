import { randomBytes, createHash } from "node:crypto";
import { cookies } from "next/headers";
import mongoose, { Schema } from "mongoose";
import dbConnect from "./mongodb";
import User from "@/models/User";

const Session =
  mongoose.models.Session ||
  mongoose.model(
    "Session",
    new Schema({
      token: { type: String, unique: true },
      userId: String,
      expiresAt: { type: Date, expires: 0 },
    }),
  );
const hash = (token: string) =>
  createHash("sha256").update(token).digest("hex");
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  await Session.create({
    token: hash(token),
    userId,
    expiresAt: new Date(Date.now() + 604800000),
  });
  (await cookies()).set("grocery_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 604800,
  });
}
export async function currentUser() {
  const token = (await cookies()).get("grocery_session")?.value;
  if (!token) return null;
  await dbConnect();
  const session = await Session.findOne({
    token: hash(token),
    expiresAt: { $gt: new Date() },
  });
  return session ? User.findById(session.userId).select("-password") : null;
}
export async function deleteSession() {
  const jar = await cookies();
  const token = jar.get("grocery_session")?.value;
  if (token) {
    await dbConnect();
    await Session.deleteOne({ token: hash(token) });
  }
  jar.delete("grocery_session");
}
