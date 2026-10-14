import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import dotenv from 'dotenv';
import {MongoClient} from 'mongodb';
dotenv.config({path:'.env.local',quiet:true});dotenv.config({path:'.env',quiet:true});
const uri=process.env.MONGODB_URI||'mongodb://localhost:27017/ai_smart_grocery';
const client=new MongoClient(uri,{serverSelectionTimeoutMS:8000});
try{
 await client.connect();const db=client.db();
 console.log(JSON.stringify({target:uri.includes('localhost')||uri.includes('127.0.0.1')?'MongoDB local':'MongoDB configured (remote)',database:db.databaseName,recipes:await db.collection('recipes').countDocuments(),deals:await db.collection('deals').countDocuments()}));
 if(process.argv.includes('--apply')){
  const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/data/mockData.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports});
  for(const r of exports.recipes){
   await db.collection('recipes').updateOne({id:r.id},{$setOnInsert:{...r,createdAt:new Date(),dataSource:'demo'},$set:{updatedAt:new Date()}},{upsert:true});
   const current=await db.collection('recipes').findOne({id:r.id});
   const ingredients=r.cookingGuide ? r.ingredients : (current.ingredients??[]).map(i=>({...i,image:fs.existsSync('public/images/catalog/'+i.id+'.svg')?'/images/catalog/'+i.id+'.svg':r.image}));
   await db.collection('recipes').updateOne({_id:current._id},{$set:{image:r.image,cuisine:current.cuisine||'Việt Nam',ingredients,...(r.cookingGuide ? {cookingGuide:r.cookingGuide,instructions:r.instructions,prepTime:r.prepTime,cookTime:r.cookTime,totalPrice:r.totalPrice} : {})}});
  }
  for(const d of exports.DEALS_DATA)await db.collection('deals').updateOne({ingredientId:d.ingredientId},{$setOnInsert:{...d,createdAt:new Date(),dataSource:'demo'},$set:{updatedAt:new Date()}},{upsert:true});
  for(const d of exports.DEALS_DATA)await db.collection('deals').updateOne({ingredientId:d.ingredientId},{$set:{image:d.image}});
  await db.collection('deals').createIndex({ingredientId:1},{unique:true});
  const recipes=await db.collection('recipes').find().toArray(),deals=await db.collection('deals').find().toArray();
  const missing=[...recipes,...deals,...recipes.flatMap(r=>r.ingredients??[])].filter(x=>!x.image||(x.image.startsWith('/')&&!fs.existsSync('public'+x.image)));
  console.log(JSON.stringify({recipes:recipes.length,deals:deals.length,missingImages:missing.length,historyPreserved:true}));
 }
}catch(e){console.error('MongoDB operation failed: '+e.name);process.exitCode=1;}finally{await client.close();}
