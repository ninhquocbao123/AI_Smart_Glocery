import fs from 'node:fs';
import sharp from 'sharp';
const dir='public/images/food';
const credits=JSON.parse(fs.readFileSync(dir+'/credits.json','utf8'));
for(const file of fs.readdirSync('scripts').filter(f=>/^photo-(recipe|deal)-\d+\.json$/.test(f))){
 const {id,path}=JSON.parse(fs.readFileSync('scripts/'+file,'utf8'));
 await sharp(path).resize(960,640).webp({quality:85}).toFile(dir+'/'+id+'.webp');
 credits[id]={title:id,source:'AI-generated illustration',author:'OpenAI image generation',license:'Generated for this project',changes:'Resized and converted to WebP'};
}
fs.writeFileSync(dir+'/credits.json',JSON.stringify(credits,null,2));
const esc=s=>String(s??'').replace(/<[^>]*>/g,'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rows=Object.entries(credits).sort().map(([id,c])=>`<article><img src="${id}.webp" alt="${esc(c.title)}"><h2>${esc(id)}</h2><p>${esc(c.title)}</p><p>Tác giả: ${esc(c.author)}</p><p>${esc(c.license)} · ${esc(c.changes)}</p>${c.source.startsWith('https://')?`<a href="${esc(c.source)}">Nguồn gốc</a>`:'<p>Ảnh minh họa tạo bằng AI cho dự án EXE202.</p>'}${c.licenseUrl?` · <a href="${esc(c.licenseUrl)}">Giấy phép</a>`:''}</article>`).join('');
fs.writeFileSync(dir+'/credits.html',`<!doctype html><html lang="vi"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Nguồn ảnh danh mục</title><style>body{font:16px system-ui;max-width:1100px;margin:30px auto;padding:20px;background:#f5f8f2;color:#203b2c}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}article{background:white;padding:16px;border-radius:16px}img{width:100%;height:170px;object-fit:cover}h2{font-size:18px}a{color:#177b3b}</style><h1>Nguồn ảnh danh mục</h1><p>Ảnh minh họa cho dự án EXE202, không đại diện sản phẩm thực tế của siêu thị. Ảnh AI và ảnh chụp được ghi rõ bên dưới.</p><main>${rows}</main></html>`);
for(const [id] of Object.entries(credits))await sharp(dir+'/'+id+'.webp').metadata();
console.log(JSON.stringify({images:Object.keys(credits).length,decoded:true}));
