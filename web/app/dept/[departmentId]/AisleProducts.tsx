import {Disclosure} from "@headlessui/react";
import {ChevronUpIcon} from "@heroicons/react/20/solid";
import {Product} from "@/types/cart";


export default function AisleProducts({ title, products }: { title: string; products: Product[] }) {
  return (
    <div className="w-full max-w-md mx-auto">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 text-lg font-medium text-left text-gray-900 bg-gray-100 rounded-lg focus:outline-none focus-visible:ring focus-visible:ring-gray-500">
              <span>{title}</span>
              <ChevronUpIcon
                className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-2 pb-2 text-gray-700">
              <ul className="space-y-1">
                {products.map((product, index) => (
                  <li key={index} className="p-2 border border-gray-200 rounded-lg">
                    {product.product_name}
                  </li>
                ))}
              </ul>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}

// export default async function AisleProducts2({ aisle_id, }: { aisle_id: number }) {
//   const aisles_products = await getAisleProducts(aisle_id);
//   return (
//     <div key={aisle_id} className="container mx-auto px-4 py-8">
//       {aisles_products &&
//         <div className="overflow-hidden rounded-md bg-white">
//           <ul role="list" className="divide-y divide-gray-200 gap-4">
//             {aisles_products.map(product => (
//               <li key={product.product_id} className="px-6 py-4 text-xs shadow-md">
//                 {product.product_name}
//               </li>
//             ))}
//           </ul>
//         </div>
//       }
//     </div>
//   );
// };
