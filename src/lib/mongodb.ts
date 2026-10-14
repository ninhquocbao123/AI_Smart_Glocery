import mongoose from "mongoose";
const uri =
  process.env.MONGODB_URI || "mongodb://localhost:27017/ai_smart_grocery";
type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};
const globalDB = globalThis as typeof globalThis & { groceryDB?: Cache };
const cached =
  globalDB.groceryDB ?? (globalDB.groceryDB = { conn: null, promise: null });
export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise)
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    });
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}
