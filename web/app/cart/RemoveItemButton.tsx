"use client"
import useSession from "@/lib/use-session";
import {useRouter} from "next/navigation";
import {Product} from "@/types/cart";


export default function RemoveItemButton({ productId }: { productId: number }) {
  const { session, isLoading, remove } = useSession();
  const router = useRouter()
  if(isLoading) return null;

  return (
    // <button
    //   className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
    <button
      type="button"
      className="text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:mt-3"
      // onClick={() => {
      //   const sessionItems: Product[] = session?.items || [];
      //   remove(productId, {
      //       optimisticData: {
      //         ...session,
      //         items: sessionItems.filter(i => i.product_id !== String(productId)),
      //       },
      //       revalidate: true,
      //     }).then(r => router.refresh());
      //
      // }}
      onClick={() => remove(productId)}
    >
      remove
    </button>
  )
}