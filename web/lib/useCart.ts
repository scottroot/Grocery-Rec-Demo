import useSWR, { useSWRConfig } from "swr";
import {SessionData} from "@/lib/session";
import useSWRMutation from "swr/mutation";
import {Product} from "@/types";

// const fetcher = (url: string) => fetch(url).then((res) => res.json());
async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  return fetch(input, {
    headers: {
      accept: "application/json",
      "content-type": "application/json",
    },
    ...init,
  }).then((res) => res.json());
}

export function useCart() {
  const { data, mutate, isLoading, isValidating, error } = useSWR<SessionData>(
    "/api/cart",
    fetcher,
    { refreshInterval: 5000 }
  );

  const switchUser = async (userId?: number) => {
    await fetch("/api/cart/switch-user", { method: "POST", body: JSON.stringify({ userId }) });
    mutate();
  };

  const addToCart = async (productId: number) => {
    await fetch("/api/cart/add", { method: "POST", body: JSON.stringify({ productId }) });
    mutate();
  };

  const removeFromCart = async (productId: number) => {
    await fetch("/api/cart/remove", { method: "POST", body: JSON.stringify({ productId }) });
    await mutate();
  };

  const clearCart = async () => {
    await fetch("/api/cart/clear", { method: "POST" });
    mutate();
  };

  return {
    cart: (data?.cart || []) as Product[],
    userId: data?.userId || 0,
    switchUser,
    isLoading: isLoading,
    addToCart,
    removeFromCart,
    clearCart
  };
}
