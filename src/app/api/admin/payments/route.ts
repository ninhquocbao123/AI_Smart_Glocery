import Order from '@/models/Order';
import { adminRequired, ApiError, fail } from '@/lib/server/http';
import { paymentPeriod } from '@/lib/server/payment-period';
export async function GET(req:Request){
  try{
    await adminRequired();
    const query=new URL(req.url).searchParams;
    const date=query.get('date')??new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Ho_Chi_Minh',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
    const period=query.get('period')??'day',page=Number(query.get('page')??1);
    if(!['day','month'].includes(period)||!Number.isSafeInteger(page)||page<1||page>100000)throw new ApiError(400,'Bộ lọc không hợp lệ.');
    const range=paymentPeriod(date);
    const dayMatch={paidAt:{$gte:range.dayStart,$lt:range.dayEnd}};
    const stats=[{$group:{_id:null,count:{$sum:1},total:{$sum:'$total'}}},{$project:{_id:0,count:1,total:1}}];
    const selected=period==='day'?[{$match:dayMatch}]:[];
    const [result]=await Order.aggregate([
      {$match:{mode:'live',paymentStatus:'paid','payment.environment':{$ne:'sandbox'},paidAt:{$gte:range.monthStart,$lt:range.monthEnd}}},
      {$facet:{
        day:[{$match:dayMatch},...stats],month:stats,
        count:[...selected,{$count:'value'}],
        orders:[...selected,{$sort:{paidAt:-1,_id:-1}},{$skip:(page-1)*25},{$limit:25},
          {$lookup:{from:'users',let:{uid:'$userId'},pipeline:[{$match:{$expr:{$eq:[{$toString:'$_id'},'$$uid']}}},{$project:{_id:0,name:1,email:1}}],as:'customer'}},
          {$project:{_id:0,orderId:1,total:1,paidAt:1,paymentMethod:1,status:1,phone:1,customer:{$arrayElemAt:['$customer',0]}}}
        ]
      }}
    ]);
    return Response.json({date,period,page,pageSize:25,totalCount:result.count[0]?.value??0,day:result.day[0]??{count:0,total:0},month:result.month[0]??{count:0,total:0},orders:result.orders},{headers:{'Cache-Control':'no-store'}});
  }catch(e){return fail(e);}
}
