import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
import { recipes } from "./src/data/mockData";
import Recipe from "./src/models/Recipe";

import User from "./src/models/User";
import Order from "./src/models/Order";
import Transaction from "./src/models/Transaction";
import bcrypt from "bcryptjs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("No MONGODB_URI found.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  // 1. Seed Recipes
  const count = await Recipe.countDocuments();
  if (count === 0) {
    await Recipe.insertMany(recipes);
    console.log("Seeded recipes successfully.");
  } else {
    console.log("Recipes already seeded.");
  }

  // 2. Seed Test User
  let testUser = await User.findOne({ email: "test@example.com" });
  if (!testUser) {
    const hashedPassword = await bcrypt.hash("123456", 10);
    testUser = new User({
      name: "Nguyễn Văn Test",
      email: "test@example.com",
      password: hashedPassword,
      phone: "0901234567",
      memberTier: "Thành viên Vàng",
      joinYear: 2024,
      points: "150K",
      orders: 3
    });
    await testUser.save();
    console.log("Seeded test user successfully (test@example.com / 123456).");
  } else {
    console.log("Test user already exists.");
  }

  // 3. Seed Mock Transactions for Budget
  const txnscount = await Transaction.countDocuments();
  if (txnscount === 0) {
    const mockTransactions = [
      {
        userId: testUser._id,
        store: "WinMart – Vincom Center",
        amount: -452000,
        category: "Thực phẩm tươi",
        categoryColor: "bg-primary/10 text-primary",
        storeImage: "🛒",
      },
      {
        userId: testUser._id,
        store: "Bách Hóa Xanh – Q1",
        amount: -128000,
        category: "Sữa & Trứng",
        categoryColor: "bg-secondary/10 text-secondary",
        storeImage: "🥬",
      }
    ];
    await Transaction.insertMany(mockTransactions);
    console.log("Seeded transactions successfully.");
  } else {
    console.log("Transactions already seeded.");
  }

  // 4. Seed Mock Orders
  const ordersCount = await Order.countDocuments();
  if (ordersCount === 0) {
    const mockOrders = [
      {
        userId: testUser._id,
        items: [
          { ingredientId: "ing-1", name: "Cà chua", price: 20000, quantity: 2, image: "" },
          { ingredientId: "ing-2", name: "Thịt bò", price: 150000, quantity: 1, image: "" }
        ],
        total: 170000,
        status: "completed",
        orderId: "FR-99123"
      },
      {
        userId: testUser._id,
        items: [
          { ingredientId: "ing-3", name: "Rau muống", price: 15000, quantity: 1, image: "" }
        ],
        total: 15000,
        status: "delivering",
        orderId: "FR-99124"
      }
    ];
    await Order.insertMany(mockOrders);
    console.log("Seeded orders successfully.");
  } else {
    console.log("Orders already seeded.");
  }

  mongoose.disconnect();
}

seed();
