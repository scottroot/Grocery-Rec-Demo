"use client"
import { useCart } from "@/lib/useCart";


export default function CartItems() {
  const { cart, removeFromCart } = useCart();

  const handleRemove = (productId: number) => {
    removeFromCart(productId)
      .then(() => console.log(`Removed ${productId} from cart`))
  }
  return (
    <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
      {cart && cart.map((item, idx) => (
        <li key={`${item.productId}_${idx}`} className="flex py-4">
          <div className="relative flex flex-1 flex-col justify-between ml-4 sm:ml-6">
            {/*<div>*/}
              <div className="flex justify-between sm:grid sm:grid-cols-2">
                <div className="pr-6">
                  <h3 className="text-sm">
                    <p className="font-medium text-gray-700 hover:text-gray-800">
                      {item.productName}
                    </p>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.productId}</p>
                </div>
              </div>

              <div className="mt-4 sm:mr-6 flex items-center sm:absolute sm:right-0 sm:top-0 sm:mt-0 sm:block">
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500 sm:mt-3"
                  onClick={() => handleRemove(item.productId)}
                >
                  remove
                </button>
              </div>
            {/*</div>*/}
          </div>
        </li>
      ))}
    </ul>
  )
}