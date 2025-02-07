import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import type { SessionData } from "@/lib/session";
import { graphRead } from "@/lib/neo4j/neo4js";

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const req: { userId: number|undefined; } = await request.json();
  const userId = req.userId;

  let newUserId: number;

  if(typeof userId === 'undefined' || userId === -1) {
    newUserId = (await graphRead(
      `MATCH (u:User)
        WHERE u.user_id <> $userId
        WITH u, rand() AS r
        ORDER BY r
        LIMIT 1
        RETURN u.user_id AS randomUserId;`,
      {userId: session?.userId || 1}
    ) as any)[0].randomUserId;
  }
  else {
    newUserId = userId;
  }
  session.userId = newUserId
  await session.save();

  return NextResponse.json({cart: session.cart || [], userId: newUserId});

}
