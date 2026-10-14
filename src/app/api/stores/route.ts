import dbConnect from "@/lib/mongodb";
import { RetailStore } from "@/models/Commerce";
import { storeDirectory } from "@/lib/stores";
import { fail } from "@/lib/server/http";
import { isLive, paymentReady } from "@/lib/server/config";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    await dbConnect();
    const configured = await RetailStore.find().lean();
    return Response.json(
      {
        mode: isLive() ? "live" : "demo",
        payments: {
          cod: true,
          momo: paymentReady("momo"),
          bank: paymentReady("bank"),
        },
        momoEnvironment:
          process.env.MOMO_ENV === "production" ? "production" : "sandbox",
        stores: storeDirectory.map((s) => {
          const config = configured.find((c) => c.key === s.key);
          return {
            ...s,
            acceptingOrders: isLive() ? !!config?.acceptingOrders : true,
            connection: "manual",
            branch: config?.branch ?? "",
            sellerName: config?.sellerName ?? "",
            serviceArea: config?.serviceArea ?? "",
          };
        }),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return fail(e);
  }
}
