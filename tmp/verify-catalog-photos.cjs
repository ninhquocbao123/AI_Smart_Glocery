const {chromium}=require('C:/Users/Ninh Quoc Bao/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const {MongoClient}=require('mongodb'),{randomUUID}=require('crypto'),fs=require('fs'),dotenv=require('dotenv');
(async()=>{
  const env={...dotenv.parse(fs.readFileSync('.env')),...dotenv.parse(fs.readFileSync('.env.local'))};
  const client=new MongoClient(env.MONGODB_URI);await client.connect();const db=client.db();
  const browser=await chromium.launch({channel:'msedge',headless:true});const context=await browser.newContext({baseURL:'http://localhost:3006',viewport:{width:1440,height:1050}});const page=await context.newPage();
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const email=`photo-check-${randomUUID()}@example.invalid`,password=randomUUID();let uid;
  try{
    const recipes=await db.collection('recipes').find({}).toArray(),deals=await db.collection('deals').find({}).toArray();
    const urls=[...new Set([...recipes.map(r=>r.image),...deals.map(d=>d.image),...recipes.flatMap(r=>r.ingredients.map(i=>i.image))])];
    if(recipes.some(r=>r.imageType!=='reference-photograph')||deals.some(r=>r.imageType!=='reference-photograph')||urls.some(u=>!u.startsWith('/api/images/')))throw Error('Photo migration incomplete');
    let cursor=0;await Promise.all(Array.from({length:6},async()=>{while(cursor<urls.length){const url=urls[cursor++];const r=await context.request.get(url);if(!r.ok()||!r.headers()['content-type'].includes('image/webp')||(await r.body()).length<500)throw Error('Image unavailable '+url);}}));
    const api=async(path,data)=>{const r=await context.request.post('/api/'+path,{data,headers:{Origin:'http://localhost:3006'}});if(!r.ok())throw Error(path+': '+r.status());return r.json();};
    await api('auth/register',{name:'Photo verification',email,password,confirmPassword:password,phone:'0900000000',address:'Dia chi kiem tra anh'});uid=(await db.collection('users').findOne({email}))._id;
    await api('auth/login',{email,password});
    for(const route of ['meal-plan','deals']){
      await page.goto('http://localhost:3006/'+route,{waitUntil:'networkidle'});
      await page.locator('img[src*="api%2Fimages"], img[src*="/api/images/"]').first().waitFor();
      await page.screenshot({path:`tmp/${route}-photos-initial.png`});
      await page.waitForFunction(()=>Array.from(document.images).filter(img=>img.getBoundingClientRect().top<innerHeight&&img.getBoundingClientRect().width>0&&img.getBoundingClientRect().height>0).every(img=>img.complete&&img.naturalWidth>0));
      await page.screenshot({path:`tmp/${route}-photos-desktop.png`});
      await page.setViewportSize({width:390,height:844});
      await page.waitForFunction(()=>Array.from(document.images).filter(img=>img.getBoundingClientRect().top<innerHeight&&img.getBoundingClientRect().width>0&&img.getBoundingClientRect().height>0).every(img=>img.complete&&img.naturalWidth>0));
      const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);if(overflow)throw Error('Mobile overflow '+route);
      await page.screenshot({path:`tmp/${route}-photos-mobile.png`});
      await page.setViewportSize({width:1440,height:1050});
    }
    const sources=await context.request.get('/photo-credits');if(!sources.ok())throw Error('Photo credits unavailable');
    console.log(JSON.stringify({recipes:recipes.length,deals:deals.length,ingredientPhotos:recipes.reduce((s,r)=>s+r.ingredients.length,0),imageEndpointsVerified:urls.length,desktopAndMobile:true,browserErrors:errors}));
    if(errors.length)throw Error('Browser errors');
  }finally{
    if(uid){const id=String(uid);for(const name of ['sessions','memberships','memberaudits','savedmealplans','pantryitems'])await db.collection(name).deleteMany({userId:id});await db.collection('memberusages').deleteMany({_id:{$regex:'^'+id+':'}});await db.collection('users').deleteOne({_id:uid,email});console.log('Removed temporary photo verification account.');}
    await browser.close();await client.close();
  }
})().catch(error=>{console.error(error.message);process.exitCode=1;});
