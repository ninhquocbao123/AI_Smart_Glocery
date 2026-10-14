import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const file='src/data/mockData.ts', marker='// BEGIN EXPANDED EXE202 CATALOG';
const source=fs.readFileSync(file,'utf8').split(marker)[0].trimEnd();
const exports={};vm.runInNewContext(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{exports});
const dishes=[
 ['Cá kho tiêu',[['Cá basa',65000,'kg',1],['Tiêu',2000,'phần',1],['Nước mắm',2000,'phần',1]],['Rửa cá, cắt khúc và để ráo.','Ướp cá với tiêu và nước mắm 15 phút.','Thêm ít nước, kho nhỏ lửa đến khi cá chín và nước sánh.']],
 ['Gà kho gừng',[['Thịt gà',45000,'phần',1],['Gừng',3000,'củ',1],['Nước mắm',2000,'phần',1]],['Rửa gà, cắt miếng vừa ăn.','Ướp gà với gừng thái sợi và nước mắm.','Xào săn, thêm nước và kho đến chín kỹ.']],
 ['Canh chua cá',[['Cá diêu hồng',45000,'phần',1],['Cà chua',4000,'quả',2],['Dứa',8000,'phần',1],['Me',3000,'phần',1]],['Sơ chế cá và rau, dầm me lấy nước chua.','Đun nước me, cho cá vào nấu chín.','Thêm cà chua và dứa, nêm vừa ăn rồi đun thêm vài phút.']],
 ['Thịt kho trứng',[['Thịt heo',40000,'phần',1],['Trứng',3500,'quả',3],['Nước mắm',2000,'phần',1]],['Luộc trứng chín rồi bóc vỏ.','Thái thịt, ướp nước mắm và chút đường.','Kho thịt cùng nước, thêm trứng rồi đun nhỏ lửa đến mềm.']],
 ['Cơm chiên rau củ',[['Cơm nguội',10000,'phần',2],['Cà rốt',5000,'củ',1],['Đậu Hà Lan',8000,'phần',1],['Dầu ăn',1000,'phần',1]],['Cắt nhỏ cà rốt, rửa đậu.','Xào rau củ đến gần chín.','Thêm cơm, đảo tơi và nêm muối; chiên đến nóng đều.']],
 ['Mướp xào trứng',[['Mướp',7000,'quả',2],['Trứng',3500,'quả',3],['Dầu ăn',1000,'phần',1]],['Gọt mướp, rửa và thái miếng.','Chiên trứng vừa se rồi lấy ra.','Xào mướp, thêm trứng, nêm và đảo đến chín.']],
 ['Canh rau ngót thịt băm',[['Rau ngót',8000,'bó',1],['Thịt heo băm',140,'gram',150]],['Nhặt và rửa sạch rau ngót.','Xào thịt băm, thêm nước đun sôi.','Cho rau vào, nấu chín và nêm vừa ăn.']],
 ['Đậu hũ chiên sả',[['Đậu hũ',5000,'miếng',3],['Sả',3000,'nhánh',2],['Dầu ăn',1000,'phần',1]],['Cắt đậu hũ, băm sả.','Chiên đậu vàng các mặt rồi lấy ra.','Phi sả, trộn đậu với chút muối và đảo đều.']],
 ['Bắp cải xào cà rốt',[['Bắp cải',12000,'phần',1],['Cà rốt',5000,'củ',1],['Tỏi',3000,'củ',1]],['Rửa bắp cải và cà rốt, thái sợi.','Phi tỏi, xào cà rốt trước.','Thêm bắp cải, nêm muối và xào chín vừa.']],
 ['Tôm rim mặn ngọt',[['Tôm',50000,'phần',1],['Hành tím',3000,'củ',1],['Nước mắm',2000,'phần',1]],['Làm sạch tôm, bỏ chỉ lưng.','Phi hành rồi cho tôm vào đảo.','Thêm nước mắm, chút đường và rim đến tôm chín đỏ.']],
 ['Trứng hấp thịt',[['Trứng',3500,'quả',3],['Thịt heo băm',140,'gram',150],['Hành lá',2000,'phần',1]],['Trộn trứng với thịt băm và hành thái nhỏ.','Nêm vừa ăn, đổ vào bát chịu nhiệt.','Hấp đến khi thịt và trứng chín hoàn toàn.']],
 ['Canh nấm đậu hũ',[['Nấm',15000,'phần',1],['Đậu hũ',5000,'miếng',2],['Hành lá',2000,'phần',1]],['Rửa nấm, cắt đậu và hành.','Đun nước sôi, thêm nấm rồi đậu.','Nấu chín, nêm muối và thêm hành.']],
 ['Sườn xào chua ngọt',[['Sườn heo',45000,'phần',1],['Cà chua',4000,'quả',2],['Hành tây',5000,'củ',1]],['Sơ chế sườn, chần rồi rửa sạch.','Chiên sườn săn, xào cà chua và hành.','Thêm sườn với nước chua ngọt, đun đến chín mềm.']],
 ['Mì xào rau củ',[['Mì',5000,'gói',2],['Rau cải',10000,'bó',1],['Cà rốt',5000,'củ',1],['Nước tương',2000,'phần',1]],['Chần mì và để ráo.','Rửa rau, thái cà rốt, xào gần chín.','Cho mì vào, thêm nước tương và đảo nóng đều.']],
];
const stores=['Bach Hoa Xanh','Winmart','Coop Food'];
const extra=dishes.map(([title,rows,instructions],n)=>{
 const id=`recipe-${String(17+n).padStart(3,'0')}`;
 const ingredients=rows.map(([name,price,unit,quantity],i)=>({id:`i-${String(17+n).padStart(3,'0')}-${i+1}`,name,price,unit,quantity,store:stores[(n+i)%3],category:/Thịt|Cá |Tôm|Sườn|Trứng/.test(name)?'Đạm':/Rau|Bắp|Cà|Nấm|Mướp|Dứa/.test(name)?'Rau củ':'Gia vị',image:''}));
 return {id,title,description:`${title} – món cơm nhà Việt Nam, dễ chuẩn bị cho bữa ăn gia đình.`,image:'',prepTime:10,cookTime:/kho|Sườn/.test(title)?35:20,servings:2,difficulty:'Dễ',cuisine:'Việt Nam',tags:['cơm nhà','món Việt'],ingredients,instructions,totalPrice:ingredients.reduce((s,i)=>s+i.price*i.quantity,0)};
});
const dealRows=[['Thịt gà',39000,49000,'khay','Đạm'],['Cá basa',45000,59000,'khay','Đạm'],['Tôm tươi',69000,85000,'khay','Đạm'],['Sườn heo',59000,72000,'khay','Đạm'],['Nấm đùi gà',19000,25000,'gói','Rau củ'],['Bắp cải',12000,18000,'bắp','Rau củ'],['Cà rốt',15000,22000,'kg','Rau củ'],['Bí xanh',14000,20000,'kg','Rau củ'],['Dưa leo',12000,17000,'kg','Rau củ'],['Hành tây',18000,24000,'kg','Rau củ'],['Dầu ăn',35000,42000,'chai','Gia vị'],['Nước mắm',28000,35000,'chai','Gia vị'],['Mì trứng',16000,22000,'gói','Tinh bột'],['Sữa tươi',27000,33000,'hộp','Sữa']];
const deals=dealRows.map(([name,price,originalPrice,unit,category],n)=>({id:`d${n+7}`,ingredientId:`deal-${String(n+7).padStart(3,'0')}`,name,price,originalPrice,unit,category,store:stores[n%3],image:'',expiresIn:'Ưu đãi minh họa'}));
const block=`\n\n${marker}\nrecipes.push(...${JSON.stringify(extra,null,2)} as Recipe[]);\nDEALS_DATA.push(...${JSON.stringify(deals,null,2)} as typeof DEALS_DATA);\nrecipes.forEach(r=>{r.image='/images/food/'+r.id+'.webp';r.ingredients.forEach(i=>{i.image='/images/catalog/'+i.id+'.svg';});});\nDEALS_DATA.forEach(d=>{d.image='/images/food/'+d.ingredientId+'.webp';});\n`;
fs.writeFileSync(file,source+block);
const all=[...exports.recipes,...extra],allDeals=[...exports.DEALS_DATA,...deals];
fs.mkdirSync('public/images/catalog',{recursive:true});
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
function art(id,title,category=''){
 const green=/Rau|rau|Đậu|đậu|nấm|cải|bí|Mướp/.test(title+category), color=green?'#69a54a':'#cb7540';
 const food=Array.from({length:9},(_,i)=>`<ellipse cx="${270+(i%3)*82}" cy="${155+Math.floor(i/3)*50}" rx="43" ry="24" fill="${i%3===0?'#edc877':color}" transform="rotate(${i*13} ${270+(i%3)*82} ${155+Math.floor(i/3)*50})"/>`).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="520" viewBox="0 0 800 520"><rect width="800" height="520" rx="24" fill="#f4efdf"/><path d="M0 390Q350 310 800 430V520H0Z" fill="#dce8cc"/><ellipse cx="400" cy="310" rx="220" ry="28" fill="#c8c5ad"/><ellipse cx="400" cy="220" rx="215" ry="132" fill="#fff"/><ellipse cx="400" cy="216" rx="182" ry="103" fill="#edf1e6"/>${food}<path d="M420 180q-80-100-95-10 60 38 95 10M430 185q40-115 83-64-18 80-83 64" fill="#2e7947"/><path d="M646 111l-23 227M673 118l-24 224" stroke="#836046" stroke-width="10" stroke-linecap="round"/><text x="400" y="411" text-anchor="middle" font-family="Arial,sans-serif" font-size="${title.length>25?25:31}" font-weight="700" fill="#214831">${esc(title)}</text><text x="400" y="453" text-anchor="middle" font-family="Arial,sans-serif" font-size="17" fill="#54715a">ẢNH MINH HỌA · BẾP VIỆT EXE202</text></svg>`;
}
for(const r of all){fs.writeFileSync(`public/images/catalog/${r.id}.svg`,art(r.id,r.title));for(const i of r.ingredients)fs.writeFileSync(`public/images/catalog/${i.id}.svg`,art(i.id,i.name,i.category));}
for(const d of allDeals)fs.writeFileSync(`public/images/catalog/${d.ingredientId}.svg`,art(d.ingredientId,d.name,d.category));
console.log(JSON.stringify({recipes:all.length,deals:allDeals.length,images:fs.readdirSync('public/images/catalog').length}));

await import('./enrich-recipes.mjs');
