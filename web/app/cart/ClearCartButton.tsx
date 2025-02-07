"use client"
import {useRouter} from "next/navigation";
import {useCart} from "@/lib/useCart";


export default function ClearCartButton() {
  const { clearCart, isLoading } = useCart();
  const router = useRouter()
  if(isLoading) return null;

  return (
    <button
      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      onClick={() => {
        clearCart().then(r => router.refresh());

      }}
    >
      clear cart
    </button>
  )
}