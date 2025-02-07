import {NextResponse} from "next/server";
import {aiGetBoughtTogether} from "@/lib/neo4j/queries/recommendations/aiGetBoughtTogether";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = Number(searchParams.get('userId') || 0);
    const productIds = searchParams.getAll("productIds").map(id => Number(id));

    if (!productIds.length) {
      return NextResponse.json({ error: "No product IDs provided." }, { status: 400 });
    }

    const recommendations = await aiGetBoughtTogether(productIds, userId)

    return NextResponse.json({ success: true, recommendations });

  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}