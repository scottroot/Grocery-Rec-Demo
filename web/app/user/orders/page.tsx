import CartItems from "@/app/cart/CartItems";
import {ArrowUturnLeftIcon} from "@heroicons/react/20/solid";
import Link from "next/link";
import {getIronSession} from "iron-session";
import {SessionData, sessionOptions} from "@/lib/session";
import { cookies } from "next/headers";
import {getUserOrders} from "@/lib/neo4j/queries/getUserOrders";
import OrderItems from "@/app/user/orders/OrderItems";
import {SearchParams} from "@/types";


export default async function OrdersPage({searchParams,}: { searchParams: SearchParams }) {
  const {ret: returnUrl} = await searchParams;
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const userId = session.userId;
  if(typeof userId !== "number") {
    return (
      <div>No orders for ya bud.</div>
    )
  }
  const orders = await getUserOrders(userId);
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white">
        {typeof returnUrl === 'string' &&
          <Link href={returnUrl} className="group flex items-center">
            <ArrowUturnLeftIcon className="inline-flex w-3 h-4 mr-2" />
            back to previous page
          </Link>
        }
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Orders
          </h1>

          <div className="mt-8 mb-6">
            <div>
              <h2 className="sr-only">Items in your shopping cart</h2>
              {/*<ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">*/}
              <ul role="list" className="space-y-6">
                {orders?.map((order) =>
                  <OrderItems key={order.orderId} order={order} />)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



