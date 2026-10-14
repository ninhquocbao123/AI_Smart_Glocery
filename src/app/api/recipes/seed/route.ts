import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Recipe from '@/models/Recipe';
import { recipes as mockRecipes } from '@/data/mockData';
import { adminRequired, sameOrigin, fail } from '@/lib/server/http';

export async function POST(req: Request) {
  try {
    sameOrigin(req);
    await adminRequired();
    await dbConnect();

    // Check if we already have recipes
    const count = await Recipe.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: 'Database already seeded with recipes.' }, { status: 200 });
    }

    // Insert mock recipes
    await Recipe.insertMany(mockRecipes);

    return NextResponse.json({ message: 'Mock recipes seeded successfully.' }, { status: 201 });
  } catch (e) {
    return fail(e);
  }
}
