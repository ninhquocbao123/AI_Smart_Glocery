import dotenv from "dotenv";
import { MongoClient } from "mongodb";
dotenv.config({ path: ".env.local", quiet: true });
if (!process.env.MONGODB_URI) throw new Error("Set MONGODB_URI first.");
const client = new MongoClient(process.env.MONGODB_URI);
try {
  await client.connect();
  const db = client.db();
  await db.collection("orders").createIndexes([
    { key: { orderId: 1 }, unique: true },
    {
      key: { userId: 1, clientRequestId: 1 },
      unique: true,
      partialFilterExpression: { clientRequestId: { $type: "string" } },
    },
    { key: { "payment.reference": 1 }, unique: true, sparse: true },
    { key: { "payment.orderCode": 1 }, unique: true, sparse: true },
  ]);
  await db.collection("offers").createIndexes([
    { key: { store: 1, ingredientId: 1 }, unique: true },
    { key: { store: 1, sku: 1 }, unique: true },
  ]);
  await db.collection("retailstores").createIndex({ key: 1 }, { unique: true });
  await db
    .collection("requestlimits")
    .createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  console.log(
    "Indexes prepared. Existing records were not deleted or reseeded.",
  );
} finally {
  await client.close();
}
