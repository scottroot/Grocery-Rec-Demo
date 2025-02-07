import {Product, ProductFull} from "@/types";
import toTitleCase from "@/utils/toTitleCase";
import AddToCartButton from "@/components/AddToCartButton";
import Link from "next/link";


function ListItem({ result }: { result: ProductFull }) {
  return (
    <li className="rounded border-2 border-gray-200">
      <div className="flex flex-col justify-between min-w-0 h-40 px-4 py-5 ">
        <div className="min-w-0 flex-auto">
          {(result?.departmentName && result?.aisleName) &&
            <p className="truncate text-xs/5 text-gray-500 italic">
              <Link href={`/dept/${result.departmentId}`} className="inline hover:underline">
                {toTitleCase(result?.departmentName)}
              </Link>
              {" "}&gt;{" "}
              <Link href={`/dept/${result.departmentId}/${result.aisleId}`} className="inline hover:underline">
                {toTitleCase(result?.aisleName)}
              </Link>
            </p>
          }
          <p className="text-base/6 font-semibold text-gray-900" title={`Product #${result.productId}`}>
            {result.productName}
          </p>
        </div>
        <div className="flex w-full items-center justify-center">
          <AddToCartButton item={result} />
        </div>
      </div>
    </li>
  )
}

export default function ResultsList({ items }: { items: null | Product[] }) {
  if (!items) return null;
  return (
    <ul role="list" className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xdivide-gray-100 gap-y-6 gap-x-4">
      {items.map((item) =>
        <ListItem result={item} key={item.productId} />
      )}
    </ul>
  )
}