import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import type { SessionData } from "@/lib/session";
import { graphRead } from "@/lib/neo4j/neo4j";


/**
 * Adds a product to the user's shopping cart stored in the session.
 *
 * - Retrieves the session from cookies using `iron-session`.
 * - Extracts `productId` from the request body.
 * - If `productId` is missing, returns the current session.
 * - If the cart is `undefined`, initializes it as an empty array.
 * - Checks if the product already exists in the cart:
 *   - If it does, the cart remains unchanged.
 *   - If not, fetches product details from the database and adds the item.
 * - Saves the updated session and returns it.
 *
 * @param request - The incoming `POST` request containing `{ productId: number }`.
 * @returns A JSON response with the updated session.
 * @throws Returns a 500 error if session retrieval, saving, or database query fails.
 */
export async function POST(request: NextRequest) {
  try {
    // Retrieve session from cookies
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);


    // Extract `productId` from request body
    const req: { productId: number | undefined } = await request.json();
    const productId = req.productId;

    // If no product ID is provided, return the current session
    if (!productId) return Response.json(session);

    // Ensure `cart` exists in session
    if (!session.cart) session.cart = [];

    // Check if product is already in the cart
    const itemExists = session.cart.some((item) => item.productId === productId);

    if (!itemExists) {
      // Fetch product name from the database
      const itemData = await graphRead(
        `MATCH (p:Product {product_id: $productId}) RETURN p.product_name AS productName`,
        { productId }
      );

      // Ensure the query returned valid product data
      if (!itemData?.length) {
        throw new Error(`Product with ID ${productId} not found in database.`);
      }

      // Add product to cart
      session.cart.push({ productId, productName: itemData[0].productName });
    }

    // Save the updated session
    await session.save();

    return Response.json(session);
  } catch (error) {
    console.error("Error adding product to cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
