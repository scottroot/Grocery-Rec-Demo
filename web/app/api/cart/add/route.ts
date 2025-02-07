import { NextRequest } from "next/server";
import {cookies} from "next/headers";
import { getIronSession } from "iron-session";
import {sessionOptions, SessionData} from "@/lib/session";
import {graphRead} from "@/lib/neo4j/neo4js";


export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const { productId } = (await request.json()) as {
    productId: number|undefined;
  };
  if (!productId) return Response.json(session);

  if (!session.cart) session.cart = [];
  const item = session.cart.find((item) => item.productId === productId);

  if (!item) {
    const itemData = await graphRead(`MATCH (p:Product {product_id: ${productId}}) return p.product_name AS product_name`);
    session.cart.push({ productId, productName: itemData[0].product_name });
  }

  await session.save();
  return Response.json(session);
}
