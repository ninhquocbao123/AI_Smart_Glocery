import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const rows=JSON.parse(fs.readFileSync('scripts/data/catalog-photo-sources.json','utf8'));
fs.writeFileSync('src/data/catalogPhotoCredits.json',JSON.stringify(rows.map(({id,name,kind,source})=>({id,name,kind,source})),null,2)+'\n');
fs.mkdirSync('tmp/catalog-photos',{recursive:true});
const results=[];
let cursor=0;
async function worker(){while(cursor<rows.length){const row=rows[cursor++];const file=path.join('tmp/catalog-photos',row.id+'.webp');try{
  if(!fs.existsSync(file)||!fs.existsSync(file+'.source')||fs.readFileSync(file+'.source','utf8')!==row.url||process.argv.includes('--refresh')){
    const response=await fetch(row.url,{signal:AbortSignal.timeout(25000),headers:{'User-Agent':'Mozilla/5.0','Referer':new URL(row.source).origin+'/'}});
    if(!response.ok)throw Error('HTTP '+response.status);
    const raw=Buffer.from(await response.arrayBuffer());
    const meta=await sharp(raw).metadata();if(!meta.width||meta.width<150||!meta.height||meta.height<100)throw Error('Image too small');
    await sharp(raw).rotate().resize(900,675,{fit:'inside',withoutEnlargement:true}).webp({quality:86}).toFile(file);
    fs.writeFileSync(file+'.source',row.url);
  }
  results.push({id:row.id,ok:true});
}catch(e){results.push({id:row.id,ok:false,error:e.message});}}}
await Promise.all(Array.from({length:6},worker));
fs.writeFileSync('tmp/catalog-photo-downloads.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({ready:results.filter(r=>r.ok).length,failed:results.filter(r=>!r.ok)}));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
for(let start=0;start<rows.length;start+=25){const batch=rows.slice(start,start+25);const tiles=[];for(let i=0;i<batch.length;i++){const r=batch[i],file=path.join('tmp/catalog-photos',r.id+'.webp');if(!fs.existsSync(file))continue;const photo=await sharp(file).resize(240,165,{fit:'contain',background:'#f5f5f5'}).toBuffer();tiles.push({input:photo,left:(i%5)*240,top:Math.floor(i/5)*210});const label=Buffer.from(`<svg width="240" height="45"><rect width="240" height="45" fill="white"/><text x="8" y="17" font-family="Arial" font-size="12">${esc(r.id)}</text><text x="8" y="35" font-family="Arial" font-size="12">${esc(r.name)}</text></svg>`);tiles.push({input:label,left:(i%5)*240,top:Math.floor(i/5)*210+165});}await sharp({create:{width:1200,height:Math.ceil(batch.length/5)*210,channels:3,background:'#eee'}}).composite(tiles).jpeg({quality:85}).toFile(`tmp/catalog-photos/sheet-${start}.jpg`);}
