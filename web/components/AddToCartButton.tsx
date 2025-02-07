"use client"
import {Product} from "@/types";
import AddToCart from "@/icons/AddToCart";
import {useEffect, useState} from "react";
import LoadingIcon from "@/icons/LoadingIcon";
import clsx from "clsx";
import {objectToQueryParams} from "@/utils/objToQuery";
import { useCart } from "@/lib/useCart";
import {HandThumbUpIcon} from "@heroicons/react/20/solid"

export default function AddToCartButton({item}: {item: Product}) {
  const { cart, isLoading, addToCart, removeFromCart, clearCart } = useCart();
  const [success, setSuccess] = useState<boolean>(false);
  useEffect(() => {
    const timer = setTimeout(() => setSuccess(false), 1000);
    return () => clearTimeout(timer);
  }, [success])

  const baseStyle = "transition-all bg-emerald-600 w-20 h-8 inline-flex items-center gap-x-1.5 rounded-md px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm";
  const successStyle = clsx(baseStyle, "font-bold");
  const inCartStyle = clsx(baseStyle, "bg-gray-500 hover:bg-gray-500/95");

  if (isLoading) return (
    <button disabled={true} className={baseStyle}>
      <LoadingIcon className="fill-white h-4 mx-auto" />
    </button>
  );

  if(success) {
    return (
      <button disabled={true} className={successStyle}>
        <span className="w-full text-center">
          {/*👍*/}
          <HandThumbUpIcon className="w-4 h-4 mx-auto" />
        </span>
      </button>
    )
  }

  const alreadyInCart = cart && cart.some(p => p.productId === item.productId);
  if(alreadyInCart) {
    return (
      <button disabled={true} className={inCartStyle}>
        <span className="w-full text-center">
          in cart
        </span>
      </button>
    )
  }

  return (
    <button
      className={`${success ? successStyle : baseStyle} hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600`}
      onClick={() => {
        addToCart(item.productId).then(r => setSuccess(true))
      }}
    >
      {/*{success*/}
      {/*  ? <span>👍</span>*/}
      {/*  : <><AddToCart className="fill-white w-4 h-4" /> Add</>*/}
      {/*}*/}
      <AddToCart className="fill-white w-4 h-4" />
      <span className="no-select">Add</span>
    </button>
  )
}