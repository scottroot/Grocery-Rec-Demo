import {NextResponse} from "next/server";
import {getSimilarUserProducts} from "@/lib/neo4j/queries/getSimilarUserProducts";


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const productIds = searchParams.getAll("productIds");

    if (!productIds.length) {
      return NextResponse.json({ error: "No product IDs provided." }, { status: 400 });
    }

    const parsedProductIds = productIds.map(id => Number(id)).filter(id => !isNaN(id));
    const recommendations = await getSimilarUserProducts(parsedProductIds)

    return NextResponse.json({ success: true, recommendations });

  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}