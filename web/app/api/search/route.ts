import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";


export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const sessionItems = session?.cart || [];

  return Response.json(sessionItems, {status: 200, statusText: "OK"});
}
