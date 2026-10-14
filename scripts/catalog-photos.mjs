import fs from 'node:fs';
const recipeQueries=['pho bo','com tam','bun cha','goi cuon','banh mi thit','thit kho tau','bo luc lac','canh chua','xoi ga','rau muong xao','tofu tomato sauce','scallion omelette','winter melon soup','stir fried bok choy','minced pork cooked','tomato egg soup','ca kho','ginger chicken Vietnamese','canh chua fish','thit kho trung','vegetable fried rice','luffa egg','rau ngot soup','lemongrass tofu','stir fried cabbage carrot','tom rim','steamed egg pork','tofu mushroom soup','sweet sour pork ribs','vegetable fried noodles'];
const dealQueries=['raw beef meat','tomatoes','chicken eggs','bok choy vegetable','tofu block','white rice uncooked','raw chicken meat','pangasius fillet','raw shrimp','raw pork ribs','pleurotus eryngii','cabbage vegetable','carrots','winter melon vegetable','cucumber vegetable','onions','cooking oil bottle','fish sauce bottle','egg noodles uncooked','milk glass'];
const jobs=[...recipeQueries.map((query,i)=>({id:`recipe-${String(i+1).padStart(3,'0')}`,query})),...dealQueries.map((query,i)=>({id:`deal-${String(i+1).padStart(3,'0')}`,query}))];
const out='scripts/catalog-photo-candidates.json';
const results=fs.existsSync(out)?JSON.parse(fs.readFileSync(out,'utf8')):[];
for(const job of jobs){
 if(results.some(r=>r.id===job.id))continue;
 const params=new URLSearchParams({action:'query',generator:'search',gsrsearch:job.query+' filetype:bitmap',gsrnamespace:'6',gsrlimit:'3',prop:'imageinfo',iiprop:'url|extmetadata',iiurlwidth:'640',format:'json'});
 await new Promise(r=>setTimeout(r,3500));
 let res=await fetch('https://commons.wikimedia.org/w/api.php?'+params,{signal:AbortSignal.timeout(25000)});
 for(let retry=0;res.status===429 && retry<4;retry++){await new Promise(r=>setTimeout(r,15000));res=await fetch('https://commons.wikimedia.org/w/api.php?'+params);}
 if(!res.ok)throw Error('Search '+res.status);
 const data=await res.json();
 const candidates=Object.values(data.query?.pages??{}).sort((a,b)=>a.index-b.index).map(p=>({title:p.title,...p.imageinfo[0]}));
 results.push({...job,candidates});fs.writeFileSync(out,JSON.stringify(results,null,2));
 console.log(job.id+': '+candidates.map(c=>c.title).join(' | '));
}
