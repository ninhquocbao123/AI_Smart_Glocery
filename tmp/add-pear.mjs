import fs from 'node:fs';
const p='scripts/data/catalog-photo-sources.json',rows=JSON.parse(fs.readFileSync(p,'utf8'));rows.push({id:'deal-exp-61',name:'Lê',kind:'deal',title:'Pear',source:'https://purpelofresh.com/products/pear',url:'https://purpelofresh.com/cdn/shop/files/pear.png?v=1724233204'});fs.writeFileSync(p,JSON.stringify(rows,null,2)+'\n');
