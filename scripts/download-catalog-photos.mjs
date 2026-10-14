import fs from 'node:fs';
import sharp from 'sharp';
const selections=JSON.parse(fs.readFileSync('scripts/catalog-photo-selections.json','utf8'));
const candidates=JSON.parse(fs.readFileSync('scripts/catalog-photo-candidates.json','utf8'));
fs.mkdirSync('public/images/food',{recursive:true});
const creditsFile='public/images/food/credits.json';
const credits=fs.existsSync(creditsFile)?JSON.parse(fs.readFileSync(creditsFile,'utf8')):{};
for(const [id,index] of Object.entries(selections)){
 if(credits[id])continue;
 const candidate=candidates.find(c=>c.id===id)?.candidates[index];
 if(!candidate)continue;
 const meta=candidate.extmetadata??{};
 const license=meta.LicenseShortName?.value??'';
 if(!/CC BY|CC0|Public domain/i.test(license))throw Error('Review license '+id+' '+license);
 let res=await fetch(candidate.thumburl??candidate.url,{signal:AbortSignal.timeout(30000)});
 for(let retry=0;res.status===429&&retry<3;retry++){await new Promise(r=>setTimeout(r,10000));res=await fetch(candidate.thumburl??candidate.url);}
 if(!res.ok)throw Error(id+' HTTP '+res.status);
 const image=await sharp(Buffer.from(await res.arrayBuffer())).rotate().resize(960,640,{fit:'inside',withoutEnlargement:true}).webp({quality:82}).toBuffer();
 fs.writeFileSync('public/images/food/'+id+'.webp',image);
 credits[id]={title:candidate.title,source:candidate.descriptionurl,author:meta.Artist?.value,license,licenseUrl:meta.LicenseUrl?.value,changes:'Resized and converted to WebP'};
 fs.writeFileSync(creditsFile,JSON.stringify(credits,null,2));
 console.log(id+' '+candidate.title);
 await new Promise(r=>setTimeout(r,1200));
}
