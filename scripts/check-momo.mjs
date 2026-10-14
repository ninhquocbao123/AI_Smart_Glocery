import dotenv from 'dotenv';
dotenv.config({path:'.env.local',quiet:true});
dotenv.config({path:'.env',quiet:true});
const keys=['MOMO_PARTNER_CODE','MOMO_ACCESS_KEY','MOMO_SECRET_KEY','APP_URL'];
let ready=true;
for(const key of keys){const present=!!process.env[key]?.trim();console.log(`${key}: ${present?'đã điền':'CHƯA ĐIỀN'}`);ready&&=present;}
const environment=process.env.MOMO_ENV||'sandbox';
console.log(`Môi trường: ${environment}`);
if(!['sandbox','production'].includes(environment)){console.log('MOMO_ENV phải là sandbox hoặc production.');ready=false;}
try{
 const url=new URL(process.env.APP_URL);
 const publicHttps=url.protocol==='https:'&&!['localhost','127.0.0.1','::1','[::1]'].includes(url.hostname);
 console.log(`IPN public HTTPS: ${publicHttps?'đã cấu hình địa chỉ (chưa kiểm tra truy cập)':'cần domain HTTPS công khai; MoMo không gọi được localhost'}`);
 if(!publicHttps)ready=false;
}catch{console.log('APP_URL chưa hợp lệ.');ready=false;}
if(environment==='production'){
 for(const [key,value] of [['LIVE_PAYMENTS_ENABLED','true'],['COMMERCE_MODE','live']]){
  const ok=process.env[key]===value;console.log(`${key}: ${ok?'đúng':'cần '+value}`);ready&&=ok;
 }
 console.log('Live còn cần cửa hàng nhận đơn, giá/tồn kho và MongoDB hỗ trợ transaction; xem PAYMENTS_SETUP.md.');
}
console.log(ready?'Cấu hình cơ bản đã đủ. Chưa gọi MoMo, chưa xác minh khóa và chưa phát sinh giao dịch.':'Chưa sẵn sàng. Xem MOMO_SETUP.md; không gửi khóa bí mật vào chat.');
process.exitCode=ready?0:1;
