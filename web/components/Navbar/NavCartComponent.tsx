"use client"
import {ShoppingCartIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import {usePathname, useSearchParams} from "next/navigation";
import {useCart} from "@/lib/useCart";




export default function NavCartComponent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentUrl = `${pathname}${searchParams ? "?" + searchParams.toString() : ""}`;

  const { cart, isLoading } = useCart();

  return (
    <Link href={`/cart?ret=${encodeURIComponent(currentUrl)}`}>
      <button
        type="button"
        className="group relative shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500"
      >
        <span className="absolute -inset-1.5" />
        <span className="sr-only">View notifications</span>
        <ShoppingCartIcon aria-hidden="true" className="size-6" />

        {cart && cart.length > 0 &&
          <div className="absolute -top-0 -right-1 flex items-center justify-center w-4 h-4 rounded-full bg-red-400 group-hover:bg-red-500 text-white">
            <span className="text-sm leading-none">
              {cart.length}
            </span>
          </div>
        }
      </button>
    </Link>
  )
}