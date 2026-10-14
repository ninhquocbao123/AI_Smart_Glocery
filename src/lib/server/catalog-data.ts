import dbConnect from "@/lib/mongodb";
import mongoose from "mongoose";
import type { Recipe } from "@/data/mockData";
import { DEALS_DATA } from "@/data/mockData";

export async function readCatalog() {
  await dbConnect();
  const db = mongoose.connection.db!;
  const [recipes, deals] = await Promise.all([
    db.collection<Recipe>("recipes").find({ active: { $ne: false } }, { projection: { _id: 0 } }).toArray(),
    db.collection<(typeof DEALS_DATA)[number]>("deals").find({}, { projection: { _id: 0 } }).toArray(),
  ]);
  return { recipes, deals };
}
