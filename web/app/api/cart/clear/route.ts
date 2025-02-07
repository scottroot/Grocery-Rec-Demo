import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, CartSession } from "@/lib/session";


export async function POST(req: NextRequest) {
  const session = await getIronSession<CartSession>(req, new NextResponse(), sessionOptions);
  session.cart = [];
  await session.save();
  return NextResponse.json([]);
}