import sharp from 'sharp';
import mongoose from 'mongoose';
import {randomUUID} from 'node:crypto';
import {userRequired,sameOrigin,fail,ApiError} from '@/lib/server/http';
export async function POST(req:Request){try{sameOrigin(req);const user=await userRequired();const form=await req.formData();const file=form.get('image');if(!(file instanceof File)||file.size>4*1024*1024)throw new ApiError(400,'Chọn ảnh nhỏ hơn 4 MB.');let data:Buffer;try{data=await sharp(Buffer.from(await file.arrayBuffer()),{limitInputPixels:20000000}).rotate().resize(400,400,{fit:'cover'}).webp({quality:85}).toBuffer();}catch{throw new ApiError(400,'Ảnh không hợp lệ.');}const id=randomUUID();await mongoose.connection.db!.collection('recipe_images').insertOne({id,data,contentType:'image/webp',createdAt:new Date()});user.avatar='/api/images/'+id;await user.save();return Response.json({avatar:user.avatar});}catch(e){return fail(e);}}
