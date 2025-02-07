import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import {sessionOptions, SessionData} from "@/lib/session";
import {cookies} from "next/headers";


export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const { productId } = (await request.json()) as {
    productId: number|undefined;
  };
  console.log(`post remove, productId type = ${typeof productId}`);
  if (!productId) return Response.json(session);

  if (!session.cart) session.cart = [];

  // session.cart = session.cart.filter((item) => item.productId !== productId);
  session.cart = session.cart.filter((item) => {
    console.log(`POST remove - comparing item ids... item.productId !== productId --> ${item.productId} !== ${productId} :: ${item.productId !== productId}`);
    console.log(`item.product_id = ${item.product_id}`)
    return item.productId !== productId
  });
  await session.save();

  return Response.json(session);
}
