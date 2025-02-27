import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/session";


/**
 * Removes a specific product from the user's shopping cart stored in the session.
 *
 * - Retrieves the session from cookies using `iron-session`.
 * - Extracts the `productId` from the request body.
 * - If `productId` is missing, returns the current session.
 * - If the cart is `undefined`, initializes it as an empty array.
 * - Removes the product from the cart if it exists.
 * - Saves the updated session and returns it.
 *
 * @param request - The incoming `POST` request containing `{ productId: number }`.
 * @returns A JSON response with the updated session, or an error message if the operation fails.
 * @throws Returns a 500 error if session retrieval or saving fails.
 */
export async function POST(request: NextRequest) {
  try {
    // Retrieve session from cookies
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    // Extract `productId` from request body
    const { productId } = (await request.json()) as { productId: number | undefined };

    // If no product ID is provided, return the current session as-is
    if (!productId) return Response.json(session);

    // Ensure `cart` exists in session
    if (!session.cart) session.cart = [];

    // Remove the product from the cart
    session.cart = session.cart.filter((item) => item.productId !== productId);

    // Save the updated session
    await session.save();

    return Response.json(session);
  } catch (error) {
    console.error("Error removing product from cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
