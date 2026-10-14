import mongoose from 'mongoose';
import dbConnect from '@/lib/mongodb';
import { fail } from '@/lib/server/http';
export const runtime = 'nodejs';
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/.test(id)) return new Response(null, { status: 404 });
    await dbConnect();
    const row = await mongoose.connection.db!.collection('recipe_images').findOne({ id });
    if (!row) return new Response(null, { status: 404 });
    return new Response(new Uint8Array(row.data.buffer), { headers: { 'Content-Type': 'image/webp', 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
  } catch (e) { return fail(e); }
}
