import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import sharp from 'sharp';
import { adminRequired, ApiError, fail, rateLimit, sameOrigin } from '@/lib/server/http';

export const runtime = 'nodejs';
export async function POST(req: Request) {
  try {
    sameOrigin(req); const user = await adminRequired();
    await rateLimit(`recipe-image:${user._id}`, 15);
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(req.headers.get('content-type') ?? '')) throw new ApiError(415, 'Chọn ảnh JPG, PNG hoặc WebP.');
    const reader = req.body?.getReader();
    if (!reader) throw new ApiError(400, 'Thiếu ảnh.');
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 3 * 1024 * 1024) { await reader.cancel(); throw new ApiError(413, 'Ảnh tối đa 3 MB.'); }
      chunks.push(value);
    }
    let data: Buffer;
    try {
      const source = sharp(Buffer.concat(chunks), { limitInputPixels: 20000000 });
      const metadata = await source.metadata();
      if (!['jpeg', 'png', 'webp'].includes(metadata.format ?? '') || (metadata.pages ?? 1) > 1) throw Error();
      data = await source.rotate().resize(1600, 1200, { fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
    } catch { throw new ApiError(400, 'Ảnh bị lỗi hoặc kích thước quá lớn. Vui lòng chọn ảnh khác.'); }
    const id = randomUUID();
    await mongoose.connection.db!.collection('recipe_images').insertOne({ id, data, createdBy: String(user._id), createdAt: new Date() });
    return Response.json({ image: `/api/images/${id}` }, { status: 201 });
  } catch (e) { return fail(e); }
}
