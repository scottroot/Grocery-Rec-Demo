import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";
import {Product} from "@/types";

export async function GET(req: NextRequest): Promise<NextResponse<{cart: Product[], userId: number}>> {
  const session = await getIronSession<SessionData>(req, new NextResponse(), sessionOptions);
  return NextResponse.json({cart: session.cart || [], userId: session.userId || 0});
}