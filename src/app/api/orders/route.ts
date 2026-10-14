import Order from "@/models/Order";
import {
  ApiError,
  body,
  fail,
  rateLimit,
  sameOrigin,
  stringValue,
  userRequired,
} from "@/lib/server/http";
import { cancelOrder, placeOrder } from "@/lib/server/order-service";
import { isLive } from "@/lib/server/config";
export const runtime = "nodejs";
export async function GET() {
  try {
    const user = await userRequired();
    return Response.json(
      {
        orders: await Order.find({ userId: String(user._id) })
          .sort({ createdAt: -1 })
          .limit(500),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return fail(e);
  }
}
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const user = await userRequired();
    await rateLimit("orders:" + user._id, 10);
    return Response.json(
      { order: await placeOrder(String(user._id), await body(req)) },
      { status: 201 },
    );
  } catch (e) {
    return fail(e);
  }
}
export async function PATCH(req: Request) {
  try {
    sameOrigin(req);
    const user = await userRequired();
    const data = await body(req);
    const id = stringValue(data.id, 1, 100);
    if (["demoPay", "demoShip", "demoReceive"].includes(String(data.action))) {
      if(isLive())throw new ApiError(403,"Thao tác này chỉ dành cho đơn thử nghiệm.");
      const action=String(data.action);
      const from=action==="demoPay"?["unpaid"]:action==="demoShip"?["confirmed"]:["delivering","delivered"];
      const to=action==="demoPay"?"confirmed":action==="demoShip"?"delivering":"completed";
      const order=await Order.findOneAndUpdate({orderId:id,userId:String(user._id),mode:"demo",status:{$in:from},
        ...(action==="demoPay"?{"payment.startedAt":{$exists:false},"payment.environment":{$ne:"sandbox"}}:{paymentStatus:{$in:["paid","cod"]}})},
        {$set:{status:to,...(action!=="demoShip"?{paymentStatus:"paid",paidAt:new Date()}: {})}}, {new:true});
      if(!order)throw new ApiError(409,"Đơn không hỗ trợ bước mô phỏng này.");
      return Response.json({order});
    }
    if (data.action === "cancel")
      return Response.json({ order: await cancelOrder(String(user._id), id) });
    if (data.action !== "receive")
      throw new ApiError(400, "Thao tác không hợp lệ.");
    const order = await Order.findOneAndUpdate(
      {
        orderId: id,
        userId: String(user._id),
        status: { $in: ["delivering", "delivered"] },
      },
      { $set: { status: "completed" } },
      { new: true },
    );
    if (!order)
      throw new ApiError(409, "Đơn hàng không tồn tại hoặc chưa được giao.");
    return Response.json({ order });
  } catch (e) {
    return fail(e);
  }
}
