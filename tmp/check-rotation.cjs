const fs = require('fs');
const vm = require('vm');
const ts = require('typescript');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');
const context = { exports: {} };
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/lib/deal-rotation.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, context);
(async () => {
  const env = { ...dotenv.parse(fs.readFileSync('.env')), ...dotenv.parse(fs.readFileSync('.env.local')) };
  const client = new MongoClient(env.MONGODB_URI);
  try {
    await client.connect();
    const db = client.db();
    console.log(JSON.stringify({sample:await db.collection('deals').findOne({},{projection:{ingredientId:1,price:1,originalPrice:1,active:1}}),all:await db.collection('deals').countDocuments()}));
    const pool = await db.collection('deals').find({ active: { $ne: false }, $expr: { $gt: ['$originalPrice', '$price'] } }).toArray();
    const history = await db.collection('goldenrotations').find({ _id: { $regex: '^catalog:' } }).toArray();
    const today = history.find(row => row.date === context.exports.vietnamDate());
    const next = context.exports.nextDealSelection(pool.map(row => row.ingredientId), history);
    const overlap = next.filter(id => today?.ids.includes(id)).length;
    console.log(JSON.stringify({ date: context.exports.vietnamDate(), history: history.map(row => ({date:row.date,count:row.ids.length})), selected: today?.ids.length, next: next.length, overlap }));
    if (!today || today.ids.length !== 20 || next.length !== 20 || overlap !== 0) throw Error('Rotation verification failed');
    console.log(JSON.stringify({ totalRecipes: await db.collection('recipes').countDocuments(), totalDeals: pool.length, today: today.ids.length, tomorrow: next.length, overlap, readOnly: true }));
  } finally { await client.close(); }
})().catch(error => { console.error(error.name); process.exitCode = 1; });

