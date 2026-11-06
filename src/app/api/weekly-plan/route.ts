import mongoose from 'mongoose';
import {body,fail,sameOrigin,userRequired,ApiError,integer} from '@/lib/server/http';
import {readCatalog} from '@/lib/server/catalog-data';
import {vietnamToday,weekStart,validWeek,dayDate,WEEK_DAYS,sameMeals} from '@/lib/weekly-calendar';
import type {Recipe} from '@/data/mockData';
type Row={_id:string;version:number;weekStart?:string;plan:Record<string,Record<string,string>>;snapshots?:Record<string,Record<string,Recipe>>;servings:number;budget:number;updatedAt:Date};
const collection=()=>mongoose.connection.db!.collection<Row>('weeklyplans');
async function readWeek(userId:string,week:string){
 const row=await collection().findOne({_id:`${userId}:${week}`}); if(row)return row;
 const legacy=await collection().findOne({_id:userId});
 // Undated schedules belong only to the week of their last saved timestamp.
 return legacy && legacy.updatedAt && weekStart(vietnamToday(new Date(legacy.updatedAt)))===week ? legacy : null;
}
export async function GET(req:Request){try{
 const user=await userRequired();const week=new URL(req.url).searchParams.get('week')??weekStart(vietnamToday());if(!validWeek(week))throw new ApiError(400,'Tuần không hợp lệ.');
 const row=await readWeek(String(user._id),week);if(!row)return Response.json({plan:{},version:0,weekStart:week});
 const {recipes}=await readCatalog();const plan:Record<string,Record<string,Recipe>>={};
 for(const[day,meals]of Object.entries(row.plan)){plan[day]={};for(const[slot,id]of Object.entries(meals)){const recipe=row.snapshots?.[day]?.[slot]??recipes.find(r=>r.id===id);if(recipe)plan[day][slot]=recipe;}}
 return Response.json({plan,version:row._id.includes(':')?row.version:0,weekStart:week,budget:row.budget,servings:row.servings});
}catch(e){return fail(e);}}
export async function PUT(req:Request){try{
 sameOrigin(req);const user=await userRequired();const userId=String(user._id);const data=await body(req);const week=data.weekStart;if(!validWeek(week))throw new ApiError(400,'Tuần không hợp lệ.');
 const today=vietnamToday();if(dayDate(week,'CN')<today)throw new ApiError(400,'Tuần đã qua chỉ có thể xem lại.');
 const version=integer(data.version,0,Number.MAX_SAFE_INTEGER),servings=integer(data.servings,1,20),budget=integer(data.budget,1000,50000000);
 if(!data.plan||typeof data.plan!=='object'||Array.isArray(data.plan))throw new ApiError(400,'Lịch không hợp lệ.');
 const existing=await readWeek(userId,week);const {recipes}=await readCatalog();const byId=new Map(recipes.map(r=>[r.id,r]));
 const plan:Row['plan']={};const snapshots:NonNullable<Row['snapshots']>={};
 for(const[day,raw]of Object.entries(data.plan)){
 if(!WEEK_DAYS.includes(day)||!raw||typeof raw!=='object'||Array.isArray(raw))throw new ApiError(400,'Ngày không hợp lệ.');
 const meals:Record<string,string>={};snapshots[day]={};
 for(const[slot,id]of Object.entries(raw)){
 if(!['breakfast','lunch','dinner'].includes(slot)||typeof id!=='string')throw new ApiError(400,'Món ăn không hợp lệ.');
 const old=existing?.snapshots?.[day]?.[slot];const recipe=old?.id===id?old:byId.get(id);if(!recipe)throw new ApiError(400,'Món ăn không còn trong danh mục.');meals[slot]=id;snapshots[day][slot]=recipe;
 }plan[day]=meals;
 }
 for(const day of WEEK_DAYS){if(dayDate(week,day)<today&&!sameMeals(plan[day],existing?.plan[day]))throw new ApiError(400,'Không thể thay đổi bữa ăn của ngày đã qua.');}
 // Keep legacy repeats in immutable history, but reject every new repeat.
 const used=new Set<string>();for(const day of WEEK_DAYS.filter(d=>dayDate(week,d)<today)){Object.values(plan[day]??{}).forEach(id=>used.add(id));}
 for(const day of WEEK_DAYS.filter(d=>dayDate(week,d)>=today)){for(const id of Object.values(plan[day]??{})){if(used.has(id))throw new ApiError(400,'Các bữa trong tuần không được trùng món.');used.add(id);}}
 try{const row=await collection().findOneAndUpdate({_id:`${userId}:${week}`,version},{$set:{weekStart:week,plan,snapshots,servings,budget,updatedAt:new Date()},$inc:{version:1}},{upsert:version===0,returnDocument:'after'});if(!row)throw new ApiError(409,'Lịch đã được sửa trên thiết bị khác. Tải lại trước khi lưu.');return Response.json({version:row.version});}catch(e){if((e as {code?:number}).code===11000)throw new ApiError(409,'Lịch đã được sửa trên thiết bị khác. Tải lại trước khi lưu.');throw e;}
}catch(e){return fail(e);}}
