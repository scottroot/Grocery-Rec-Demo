import {graphRead} from "@/lib/neo4j/neo4js";
import CartItems from "@/app/cart/CartItems";
import {ArrowUturnLeftIcon} from "@heroicons/react/20/solid";
import Link from "next/link";
import RecGrid from "./RecGrid";


export default async function CartPage({searchParams,}: { searchParams: {ret?: string} }) {
  const {ret: returnUrl} = await searchParams;
  // const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  // const recommendations = session?.items?.length > 0 && await getRecommendations(session.items?.map(i => Number(i.product_id)))
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white">
        {returnUrl &&
          <Link href={returnUrl} className="group flex items-center">
            <ArrowUturnLeftIcon className="inline-flex w-3 h-4 mr-2" />
            back to previous page
          </Link>
        }
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Shopping Cart
          </h1>

          <form className="mt-8 mb-6">
            <div>
              <h2 className="sr-only">Items in your shopping cart</h2>
              <CartItems />
            </div>
          </form>
          <RecGrid />
        </div>
      </div>
    </div>
  );
};



