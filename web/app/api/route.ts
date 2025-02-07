import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { defaultSession, sessionOptions, sleep, SessionData } from "@/lib/sessionLib";
import {Product} from "@/types/cart";


export async function POST(request: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const sessionItems: Product[] = session?.items || [];
  const { item, removeId } = (await request.json()) as { item?: Product; removeId?: number };
  console.log(`***POST - session.items = ${JSON.stringify(sessionItems)}, item = ${JSON.stringify(item)}`);
  if(!item) {
    console.log("POST, no item ... ??" + JSON.stringify(item));
  };
  if(item) {
    if(sessionItems && sessionItems.length > 0) {
      session.items = [...session.items, item] as Product[];
    } else {
      session.items = [item] as Product[];
    }
  }
  else {
    session.items = sessionItems.filter(item => item.product_id !== String(removeId))
  }

  await session.save();
  return Response.json(session);
}

export async function PATCH(request: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const sessionItems: Product[] = session?.items || [];
  const { removeId = -1 } = (await request.json()) as { removeId: number};
  console.log(`Going to use removeId = ${JSON.stringify(removeId)}`);
  if(!removeId || removeId < 0) {return}
  // session.items = [
  //   ...sessionItems.slice(0, removeIndex),
  //   ...sessionItems.slice(removeIndex + 1)
  // ];
  session.items = sessionItems.filter(item => item.product_id !== String(removeId))
  console.log(JSON.stringify({desc: "PATCH", items: session.items}));
  await session.save();

  return Response.json(session);
}

// read session
export async function GET() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  // console.log(`*** GET, session.items = ${JSON.stringify(session.items)}`);
  const sessionItems = session?.items || [];

  // if (sessionItems.length < 1) {
  //   return Response.json(defaultSession);
  // }

  return Response.json(session);
}


export async function DELETE() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  session.destroy();

  return Response.json(defaultSession);
}