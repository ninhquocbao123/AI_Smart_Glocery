import { randomUUID } from 'node:crypto';
import { access } from 'node:fs/promises';
import path from 'node:path';
import mongoose from 'mongoose';
import type { Recipe } from '@/data/mockData';
import { adminRequired, ApiError, body, fail, sameOrigin, stringValue } from '@/lib/server/http';
import { recipeInput } from '@/lib/server/recipe-input';

export async function GET() {
  try {
    await adminRequired();
    const recipes = await mongoose.connection.db!.collection('recipes').find({}, { projection: { _id: 0 } }).sort({ updatedAt: -1, title: 1 }).toArray();
    return Response.json({ recipes }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) { return fail(e); }
}
async function save(req: Request, create: boolean) {
  try {
    sameOrigin(req);
    const user = await adminRequired();
    const input = await body(req);
    const collection = mongoose.connection.db!.collection<Recipe>('recipes');
    const id = create ? `recipe-${randomUUID()}` : stringValue(input.id);
    const existing = create ? undefined : await collection.findOne({ id });
    if (!create && !existing) throw new ApiError(404, 'Không tìm thấy món ăn.');
    const recipe = recipeInput(input, id, existing ?? undefined);
    if (recipe.image.startsWith('/api/images/')) {
      if (!await mongoose.connection.db!.collection('recipe_images').findOne({ id: recipe.image.split('/').pop() }, { projection: { _id: 1 } })) throw new ApiError(400, 'Ảnh chưa được tải lên.');
    } else {
      try { await access(path.join(process.cwd(), 'public', recipe.image)); } catch { throw new ApiError(400, 'Không tìm thấy ảnh món ăn.'); }
    }
    const record = { ...recipe, updatedAt: new Date(), updatedBy: String(user._id) };
    if (create) await collection.insertOne(record);
    else await collection.updateOne({ id }, { $set: record });
    return Response.json({ recipe }, { status: create ? 201 : 200 });
  } catch (e) { return fail(e); }
}
export async function POST(req: Request) { return save(req, true); }
export async function PUT(req: Request) { return save(req, false); }
export async function PATCH(req: Request) {
  try {
    sameOrigin(req); await adminRequired();
    const input = await body(req);
    if (typeof input.active !== 'boolean') throw new ApiError(400, 'Trạng thái không hợp lệ.');
    const result = await mongoose.connection.db!.collection('recipes').updateOne({ id: stringValue(input.id) }, { $set: { active: input.active, updatedAt: new Date() } });
    if (!result.matchedCount) throw new ApiError(404, 'Không tìm thấy món ăn.');
    return Response.json({ ok: true });
  } catch (e) { return fail(e); }
}
