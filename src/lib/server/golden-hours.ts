import { Schema, models, model } from "mongoose";
import { DEFAULT_GOLDEN, type GoldenConfig } from "@/lib/golden-hours";
import mongoose from "mongoose";
import { isLive } from "./config";
import { nextDealSelection, vietnamDate } from "@/lib/deal-rotation";
import dbConnect from "@/lib/mongodb";
export const GoldenSettings =
  models.GoldenSettings ||
  model(
    "GoldenSettings",
    new Schema({
      _id: String,
      windows: [{ start: Number, end: Number, _id: false }],
      disabledIds: [String],
    }),
  );
export async function goldenConfig(): Promise<GoldenConfig> {
  await dbConnect();
  const row = await GoldenSettings.findById("daily").lean();
  const config: GoldenConfig = row ? {windows:row.windows,disabledIds:row.disabledIds??[]} : DEFAULT_GOLDEN;
  const db = mongoose.connection.db!;
  const live=isLive(), now=new Date();
  const pool=await db.collection(live?'offers':'deals').find(live?{active:true,stock:{$gt:0},validUntil:{$gt:now},$expr:{$gt:['$originalPrice','$price']}}:{active:{$ne:false},$expr:{$gt:['$originalPrice','$price']}},{projection:{ingredientId:1}}).toArray();
  const eligible=pool.map(p=>String(p.ingredientId)).filter(id=>!config.disabledIds.includes(id));
  const date=vietnamDate(now), key=(live?'live:':'catalog:')+date;
  const ledger=db.collection<{_id:string;date:string;ids:string[];createdAt:Date}>('goldenrotations');
  const previous=await ledger.find({_id:{$regex:live?'^live:':'^catalog:'},date:{$lt:date}},{projection:{ids:1,date:1}}).toArray();
  try { await ledger.updateOne({_id:key},{$setOnInsert:{date,ids:nextDealSelection(eligible,previous),createdAt:now}},{upsert:true}); }
  catch(error){if((error as {code?:number}).code!==11000)throw error;}
  const schedule=await ledger.findOne({_id:key});
  return {...config,selectedIds:(schedule?.ids??[]).filter(id=>eligible.includes(id))};
}
