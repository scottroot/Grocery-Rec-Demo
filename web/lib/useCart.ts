import useSWR from "swr";
import { SessionData } from "@/lib/session";
import fetcher from "@/lib/fetcher";
import type { Product } from "@/types";


/**
 * * Custom hook to manage the user's shopping cart using SWR.
 *  * - Uses server-side caching and revalidation for cart data.
 *  * - Provides helper functions for cart actions (add, remove, switch user, clear cart).
 *
 * @returns An object containing:
 *  - `cart`: The user's current cart (array of products).
 *  - `userId`: The ID of the currently active user.
 *  - `switchUser(userId)`: Switches the cart to a different user.
 *  - `addToCart(productId)`: Adds a product to the cart.
 *  - `removeFromCart(productId)`: Removes a product from the cart.
 *  - `clearCart()`: Clears the entire cart.
 *  - `isLoading`: Indicates if the cart data is currently loading.
 */
export function useCart() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, mutate, isLoading, isValidating, error } = useSWR<SessionData>(
    "/api/cart",
    fetcher,
    { refreshInterval: 5000 } // Auto-refreshes cart data every 5 seconds
  );

  /**
   * Switches the shopping cart to a different user.
   * If no user ID is provided, it resets to a default session.
   *
   * @param userId - The ID of the new user (optional).
   */
  const switchUser = async (userId?: number) => {
    await fetch("/api/cart/switch-user", {
      method: "POST",
      body: JSON.stringify({ userId })
    });
    mutate();
  };

  /**
   * Adds a product to the user's cart.
   *
   * @param productId - The ID of the product to add.
   */
  const addToCart = async (productId: number) => {
    await fetch("/api/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId })
    });
    mutate();
  };

  /**
   * Removes a product from the user's cart.
   *
   * @param productId - The ID of the product to remove.
   */
  const removeFromCart = async (productId: number) => {
    await fetch("/api/cart/remove", {
      method: "POST",
      body: JSON.stringify({ productId })
    });
    await mutate();
  };

  /**
   * Clears all items from the cart.
   */
  const clearCart = async () => {
    await fetch("/api/cart/clear", { method: "POST" });
    mutate();
  };

  return {
    cart: (data?.cart || []) as Product[],
    userId: data?.userId || 0,
    switchUser,
    isLoading,
    addToCart,
    removeFromCart,
    clearCart
  };
}
