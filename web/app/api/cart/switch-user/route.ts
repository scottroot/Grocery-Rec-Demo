import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import {sessionOptions, SessionData} from "@/lib/session";
import {graphRead} from "@/lib/neo4j/neo4js";
import {cookies} from "next/headers";

export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  const { userId } = (await request.json()) as { userId: number|undefined; };

  let newUserId: number;

  if(typeof userId === 'undefined' || userId === -1) {
    const randomUserId = (await graphRead(
      `MATCH (u:User)
        WHERE u.user_id <> $userId
        WITH u, rand() AS r
        ORDER BY r
        LIMIT 1
        RETURN u.user_id AS randomUserId;`,
      {userId: session?.userId || 1}
    ) as any)[0].randomUserId;
    console.log(`randomUser = ${JSON.stringify(randomUserId)}`)
    newUserId = randomUserId;
  }
  else {
    newUserId = userId;
  }
  console.log(`switch-user -- userId provided = ${userId};  newUserId = ${newUserId}`);
  session.userId = newUserId
  await session.save();
  // return Response.json(session);
  return NextResponse.json({cart: session.cart || [], userId: newUserId});

}
