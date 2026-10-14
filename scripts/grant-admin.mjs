import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
dotenv.config({path:'.env.local',quiet:true});dotenv.config({path:'.env',quiet:true});
const email=process.argv[2]?.trim().toLowerCase();
if(!email||!email.includes('@'))throw Error('Cách dùng: node scripts/grant-admin.mjs email-da-dang-ky');
const client=new MongoClient(process.env.MONGODB_URI||'mongodb://localhost:27017/ai_smart_grocery',{serverSelectionTimeoutMS:8000});
try{
 await client.connect();const users=client.db().collection('users');
 const user=await users.findOne({email},{projection:{_id:1}});
 if(!user){console.log('Không tìm thấy tài khoản đã đăng ký. Chưa cấp quyền.');process.exitCode=1;}
 else {await users.updateOne({_id:user._id},{$set:{role:'admin'}});console.log('Đã cấp quyền admin cho '+email);}
}finally{await client.close();}
