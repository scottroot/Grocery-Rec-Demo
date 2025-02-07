import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";


export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const { productId } = (await request.json()) as {
    productId: number|undefined;
  };

  if (!productId) return Response.json(session);
  if (!session.cart) session.cart = [];

  session.cart = session.cart.filter((item) => {
    return item.productId !== productId
  });

  await session.save();

  return Response.json(session);
}
