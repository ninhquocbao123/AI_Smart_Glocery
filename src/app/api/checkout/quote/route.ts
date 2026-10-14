import {
  body,
  fail,
  sameOrigin,
  userRequired,
  rateLimit,
} from "@/lib/server/http";
import { quoteCart } from "@/lib/server/quote";
export async function POST(req: Request) {
  try {
    sameOrigin(req);
    const user = await userRequired();
    await rateLimit("quote:" + user._id, 60);
    const data = await body(req);
    return Response.json({ quote: await quoteCart(data.items, data.store) });
  } catch (e) {
    return fail(e);
  }
}
