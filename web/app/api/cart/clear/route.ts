import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import type { SessionData } from "@/lib/session";


/**
 * Clears the user's shopping cart from the session.
 *
 * - Retrieves the current session using `iron-session`.
 * - Resets the `cart` to an empty array.
 * - Saves the updated session.
 * - Returns an empty array in the response.
 *
 * @param request - The incoming `POST` request.
 * @returns A JSON response with an empty array to confirm the cart has been cleared.
 * @throws Returns a 500 error if session retrieval or saving fails.
 */
export async function POST(request: NextRequest) {
  try {
    // Retrieve session from cookies
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    // Clear the cart
    session.cart = [];
    await session.save();

    return Response.json(session);
  } catch (error) {
    console.error("Error clearing shopping cart:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
