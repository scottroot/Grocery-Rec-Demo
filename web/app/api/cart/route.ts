import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import type { Product } from "@/types";


// TODO: double check can remove this route and then delete it...
export async function GET(req: NextRequest): Promise<NextResponse<{cart: Product[], userId: number}>> {
  const session = await getIronSession<SessionData>(req, new NextResponse(), sessionOptions);
  return NextResponse.json({cart: session.cart || [], userId: session.userId || 0});
}