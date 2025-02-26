"use client"

import { useState } from "react"
import useSWR from "swr";
import { Description, Field, Label, Switch } from "@headlessui/react"
import { useCart } from "@/lib/useCart";
import AddToCartButton from "@/components/AddToCartButton";
import Carousel from "@/components/Carousel";
import toTitleCase from "@/utils/toTitleCase";
import fetcher from "@/lib/fetcher";
import type { Product } from "@/types";


function SecondaryProductGrid({title, items}: {title: string, items: Product[]}) {
  const recommendations = Array.from(
    new Map(items.map(item => [item.productId, item])).values()
  );

  const slides = recommendations.map((item) => (
    <div key={item.productId} className="shrink-0 mb-4">
      <div className="flex flex-col justify-between h-40 px-4 py-5 border border-gray-200 hover:border-gray-400 rounded-md bg-white">
        <div className="relative min-w-0 flex-auto no-select">
          <button className="absolute -inset-1 z-10 w-full h-full cursor-grab top-0 left-0 right-0 bottom-0 flex" />
          {(item?.departmentName && item?.aisleName) &&
            <p className="xmt-1 truncate text-xs/5 text-gray-500 italic no-select">
              {toTitleCase(item.departmentName)} &gt; {item.aisleName}
            </p>
          }
          <p className="text-base/6 font-semibold text-gray-900 no-select" title={`Product #${item.productId}`}>
            {item.productName}
          </p>
        </div>
        <div className="flex w-full items-center justify-start">
          <AddToCartButton item={item} />
        </div>
      </div>
    </div>
  ))
  return (
    <div className="bg-neutral-50/50 p-2 rounded-xl border border-gray-200 mb-6">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="m-4">
          <h2 className="text-2xl font-semibold">
            {title}
          </h2>
        </div>
        <Carousel slides={slides} />
      </div>
    </div>
  )
  // return (
  //   <div className="bg-white p-2 rounded-xl border border-gray-200 mb-6">
  //     <div className="mx-auto max-w-7xl px-6 lg:px-8">
  //       <div className="m-4">
  //         <h2 className="text-2xl font-semibold">
  //           {title}
  //         </h2>
  //       </div>
  //       <ul
  //         // className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 m-4 grid-rows-1"
  //         className="columns-1 gap-6 sm:columns-2 lg:columns-3 m-4"
  //         // className="w-full relative flex overflow-x-scroll"
  //       >
  //         {recommendations.map((item, idx) => (
  //           <li key={`${item.productId}_${idx}`} className="w-full shrink-0 mb-4 break-inside-avoid">
  //               <div className="flex flex-col justify-between min-w-1/4 h-40 px-4 py-5 ">
  //                 <div className="min-w-0 flex-auto">
  //                   {(item?.departmentName && item?.aisleName) &&
  //                     <p className="xmt-1 truncate text-xs/5 text-gray-500 italic">
  //                       {toTitleCase(item.departmentName)} &gt; {item.aisleName}
  //                     </p>
  //                   }
  //                   <p className="text-base/6 font-semibold text-gray-900" title={`Product #${item.productId}`}>
  //                     {item.productName}
  //                   </p>
  //                 </div>
  //                 <div className="flex w-full items-center justify-start">
  //                   <AddToCartButton item={item} />
  //                 </div>
  //               </div>
  //             </li>
  //         ))}
  //       </ul>
  //     </div>
  //   </div>
  // )
}


function RecSection({productIds, userId, endpoint, title}: {productIds: string, userId: number, endpoint: string, title: string}) {
  const recKey = productIds ? `${endpoint}?userId=${userId}&${productIds}` : null;
  const { data, isLoading } = useSWR(recKey, fetcher);
  if(isLoading) return <div>Loading {title}...</div>
  if (!data?.recommendations?.length) return null;

  return <SecondaryProductGrid title={title} items={data.recommendations} />
}

// function BoughtTogether({productIds, userId}: {productIds: string, userId: number}) {
//   const recKey = productIds ? `/api/recs?${productIds}` : null;
//   const { data, isLoading, error } = useSWR(recKey, fetcher);
//   if(isLoading) return <div>Loading BoughtTogether...</div>
//   if (!data?.recommendations?.length) return null;
//
//   return <SecondaryProductGrid title="Frequently Bought Together" items={data.recommendations} />
// }


// function SimilarUserProducts({productIds, userId}: {productIds: string, userId: number}) {
//   const recKey = productIds ? `/api/recs/similar-user-products?${productIds}` : null;
//   const { data, isLoading } = useSWR(recKey, fetcher);
//
//   if(isLoading) return <div>Loading...</div>
//   if (!data?.recommendations?.length) return null;
//
//   return <SecondaryProductGrid title="Similar shoppers add this next!" items={data.recommendations} />
// }
//

const Banner = () => (
  <>
    <div
      aria-hidden="true"
      className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
    >
      <div
        style={{
          clipPath:
            'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
        }}
        className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-20"
      />
    </div>
    <div
      aria-hidden="true"
      className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
    >
      <div
        style={{
          clipPath:
            'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
        }}
        className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-20"
      />
    </div>
  </>
)


function TypeToggle({ toggleOn, setToggleOn }: { toggleOn: boolean, setToggleOn: (enabled: boolean) => void }) {
  return (
    <div className="relative mx-auto isolate flex items-center justify-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 max-sm:before:flex-1">
      <Banner />
      <div className="mx-auto">
      <Field className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="flex grow flex-col">
          <Label as="span" passive className="text-sm/6 font-medium text-gray-900">
            <strong>Recommendation Mode: Graph ↔ LLM</strong>
          </Label>
          <Description as="span" className="text-sm text-gray-500">
            Toggle to compare classic and AI-enhanced suggestions.
          </Description>
        </span>
        <Switch
          checked={toggleOn}
          onChange={setToggleOn}
          className="animate-pulse data-[checked]:animate-none group relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none ring-2 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 data-[checked]:bg-indigo-600"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none inline-block size-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out group-data-[checked]:translate-x-7"
          />
        </Switch>
        <div className="">
            <p className="text-xs font-medium text-gray-900 w-[30ch]">
              {toggleOn
                ? <span>LLM-Enhanced Recommendations</span>
                : <span>Graph Collaborative Filtering</span>
              }
            </p>
          </div>
      </Field>
      </div>
    </div>
  )
}

export default function RecGrid() {
  const [toggleOn, setToggleOn] = useState(true)
  const {cart, userId} = useCart();
  const productIds = cart.length > 0 ? cart.map(p => `productIds=${p.productId}`).join("&") : "";
  const ctx = {userId, productIds}
  return (
    <div className="mb-6 space-y-6">
      <TypeToggle toggleOn={toggleOn} setToggleOn={setToggleOn} />
      {toggleOn
        ? (
          <div>
            <RecSection
              title={userId > 0 ? "You often buy these together!" : "Frequently bought together!"}
              endpoint="/api/recs/ai/bought-together"
              {...ctx}
            />
          </div>
        )
        : (
          <div>
            <RecSection
              title={userId > 0 ? "You often buy these together!" : "Frequently bought together!"}
              endpoint="/api/recs/std/bought-together"
              {...ctx}
            />
          </div>
        )
      }
    </div>
  )
}
