import CartItems from "./CartItems";
import RecGrid from "./RecGrid";
import {SearchParams} from "@/types";
import BackButton from "@/components/BackButton";


export default async function CartPage({ searchParams, }: { searchParams: SearchParams }) {
  const returnUrl = (await searchParams).ret as string|undefined; // changed to async in v15 I guess
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white">
        <BackButton returnUrl={returnUrl} />
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Shopping Cart
          </h1>

          <div className="mt-8 mb-6">
            <div>
              <h2 className="sr-only">Items in your shopping cart</h2>
              <CartItems />
            </div>
          </div>
          <RecGrid />
        </div>
      </div>
    </div>
  );
};



