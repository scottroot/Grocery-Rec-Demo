import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions } from "@/lib/session";
import type { SessionData } from "@/lib/session";
import { graphRead } from "@/lib/neo4j/neo4j";


/**
 * Handles user session switching.
 *
 * - If `userId` is provided, sets the session to that user.
 * - If `userId` is `undefined` or `-1`, assigns a **random user** from the database.
 * - Saves the new `userId` in the session.
 * - Returns the updated cart and `userId` in the response.
 *
 * @param request - The incoming `POST` request containing `{ userId: number | undefined }`.
 * @returns A JSON response with `{ cart: Product[], userId: number }`.
 * @throws Returns a 500 error if something goes wrong.
 */
export async function POST(request: NextRequest) {
  try {
    // Retrieve session from cookies
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    // Extract `userId` from the request body
    const req: { userId: number | undefined } = await request.json();
    const userId = req.userId;

    let newUserId: number;

    // If `userId` is `undefined` or `-1`, assign a random user
    if (typeof userId === "undefined" || userId === -1) {
      // TODO: remove this manual list once I've run the rest of the persona generations...
      // const randomUserResponse = await graphRead(
      //   `
      //   MATCH (u:User)
      //   WHERE u.user_id <> $userId
      //   WITH u, rand() AS r
      //   ORDER BY r
      //   LIMIT 1
      //   RETURN u.user_id AS randomUserId;
      //   `,
      //   { userId: session?.userId || 1 } // Default to `1` if no session user ID exists
      // );

      // // Extract new user ID from the response
      // newUserId = (randomUserResponse as any)?.[0]?.randomUserId;
      const generatedUserPersonas = [17282, 122928, 134788, 134840, 160962];
      newUserId = generatedUserPersonas[Math.floor(Math.random() * generatedUserPersonas.length)];

      // Ensure a valid `userId` is found
      if (!newUserId) {
        throw new Error("No valid random user found in the database.");
      }
    } else {
      // Otherwise, use the provided `userId`
      newUserId = userId;
    }

    // Update session with the new user ID and save it
    session.userId = newUserId;
    await session.save();

    return NextResponse.json({
      cart: session.cart || [], // Ensure cart is returned even if empty
      userId: newUserId,
    });

  } catch (error) {
    console.error("Error handling user session switch:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
