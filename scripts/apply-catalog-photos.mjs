import fs from 'node:fs';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import dotenv from 'dotenv';
import {MongoClient} from 'mongodb';

dotenv.config({path:'.env.local',quiet:true});
dotenv.config({path:'.env',quiet:true});
const apply=process.argv.includes('--apply');
const rows=JSON.parse(fs.readFileSync('scripts/data/catalog-photo-sources.json','utf8'));
const aliases=JSON.parse(fs.readFileSync('scripts/data/catalog-photo-aliases.json','utf8'));
const prepared=new Map();
for(const row of rows){
  const file=`tmp/catalog-photos/${row.id}.webp`;
  if(fs.readFileSync(file+'.source','utf8')!==row.url)throw Error(`Unverified source: ${row.id}`);
  const data=fs.readFileSync(file),meta=await sharp(data).metadata();
  if(meta.format!=='webp'||meta.width<150||meta.height<100)throw Error(`Invalid image: ${row.id}`);
  const hash=createHash('sha256').update(data).digest('hex');
  const id=`${hash.slice(0,8)}-${hash.slice(8,12)}-${hash.slice(12,16)}-${hash.slice(16,20)}-${hash.slice(20,32)}`;
  prepared.set(row.id,{...row,id,data,imageId:id,image:`/api/images/${id}`,width:meta.width,height:meta.height});
}
if(rows.filter(r=>r.kind==='recipe').length!==85||rows.filter(r=>r.kind==='deal').length!==65)throw Error('Incomplete photo manifest');
const byName=new Map(rows.filter(r=>r.kind!=='recipe').map(r=>[r.name,prepared.get(r.id)]));
const client=new MongoClient(process.env.MONGODB_URI,{serverSelectionTimeoutMS:15000});
try{
  await client.connect();const db=client.db();
  if(db.databaseName!=='ai_smart_grocery')throw Error('Unexpected database');
  const recipes=await db.collection('recipes').find({}).toArray(),deals=await db.collection('deals').find({}).toArray();
  const recipeUpdates=[],dealUpdates=[];let ingredientCount=0;
  for(const recipe of recipes){
    const photo=prepared.get(recipe.id);if(!photo)throw Error(`Missing recipe photo: ${recipe.id}`);
    const ingredients=recipe.ingredients.map(ingredient=>{
      const match=byName.get(aliases[ingredient.name]??ingredient.name);
      if(!match)throw Error(`Missing ingredient photo: ${ingredient.name}`);
      ingredientCount++;
      return {...ingredient,image:match.image,imageSource:match.source};
    });
    recipeUpdates.push({updateOne:{filter:{_id:recipe._id,image:recipe.image,ingredients:recipe.ingredients},update:{$set:{image:photo.image,imageSource:photo.source,imageType:'reference-photograph',ingredients,imageUpdatedAt:new Date()}}}});
  }
  for(const deal of deals){const photo=prepared.get(deal.ingredientId);if(!photo)throw Error(`Missing deal photo: ${deal.ingredientId}`);dealUpdates.push({updateOne:{filter:{_id:deal._id,image:deal.image},update:{$set:{image:photo.image,imageSource:photo.source,imageType:'reference-photograph',imageUpdatedAt:new Date()}}}});}
  if(apply){
    fs.mkdirSync('tmp/catalog-photo-backups',{recursive:true});
    fs.writeFileSync(`tmp/catalog-photo-backups/${Date.now()}.json`,JSON.stringify({recipes:recipes.map(r=>({id:r.id,image:r.image,imageSource:r.imageSource,imageType:r.imageType,ingredients:r.ingredients})),deals:deals.map(d=>({ingredientId:d.ingredientId,image:d.image,imageSource:d.imageSource,imageType:d.imageType}))},null,2));
    for(const photo of prepared.values())await db.collection('recipe_images').updateOne({id:photo.imageId},{$setOnInsert:{id:photo.imageId,data:photo.data,contentType:'image/webp',source:photo.source,sourceImage:photo.url,sourceTitle:photo.title,width:photo.width,height:photo.height,createdAt:new Date()}},{upsert:true});
    const r=await db.collection('recipes').bulkWrite(recipeUpdates),d=await db.collection('deals').bulkWrite(dealUpdates);
    if(r.matchedCount!==recipeUpdates.length||d.matchedCount!==dealUpdates.length)throw Error('Some catalog records changed during migration; their edits were preserved. Rerun after reviewing.');
  }
  console.log(JSON.stringify({mode:apply?'applied':'validated',recipes:recipeUpdates.length,deals:dealUpdates.length,ingredientImages:ingredientCount,photos:prepared.size,pricesAndOrdersUnchanged:true}));
}catch(error){console.error(error.message?.includes('Missing')||error.message?.includes('changed during')?error.message:error.name);process.exitCode=1;}finally{await client.close();}
