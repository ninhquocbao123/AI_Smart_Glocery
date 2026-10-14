import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const budgetStr = searchParams.get('budget');

    await dbConnect();

    const query: { active: { $ne: boolean }; totalPrice?: { $lte: number } } = { active: { $ne: false } };

    // Filter by budget if provided
    if (budgetStr) {
      const budget = parseInt(budgetStr, 10);
      if (!isNaN(budget) && budget > 0) {
        query.totalPrice = { $lte: budget };
      }
    }

    const recipes = await Recipe.find(query).sort({ totalPrice: 1 });

    return NextResponse.json({ recipes }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Không thể tải công thức." }, { status: 500 });
  }
}
