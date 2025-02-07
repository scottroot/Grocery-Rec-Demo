import Link from "next/link";
import {getDepartmentAisles} from "@/lib/neo4j/queries/getDepartmentAisles";
import {getAisleProducts} from "@/lib/neo4j/queries/getAisleProducts";
import toTitleCase from "@/utils/toTitleCase";
import {ArrowUturnLeftIcon} from "@heroicons/react/20/solid";
import ProductGrid from "@/components/ProductGrid";


export default async function DepartmentPage({ params, }: { params: Promise<{ aisleId: number }>}) {
  const aisleId = Number((await params).aisleId);
  if (!aisleId) return null;
  const aisle = await getAisleProducts(aisleId);
  if(!aisle) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="group flex items-center">
        <ArrowUturnLeftIcon className="inline-flex w-3 h-4 mr-2" />
        back to <span className="italic group-hover:underline mx-1.5">{aisle.departmentName}</span> department
      </Link>
      {/*<h1 className="text-2xl font-bold my-4">{aisle.aisle_name} ({aisleId})</h1>*/}
      <h1 className="text-2xl font-bold my-4">{aisle.aisleName}</h1>

      {aisle?.products &&
        <div className="overflow-hidden rounded-md bg-white shadow p-2">
          {/*<ul role="list" className="grid grid-cols-subgrid divide-y divide-gray-200">*/}
            {/*{aisle.products.map(p => (*/}
            {/*  <li key={p.product_id} className="px-6 py-4">*/}
            {/*    /!*<Link href={`/dept/${departmentId}/${aisle.aisle_id}`}>*!/*/}
            {/*      {p.product_name}*/}
            {/*    /!*</Link>*!/*/}
            {/*  </li>*/}
            {/*))}*/}
            <ProductGrid items={aisle.products} />
          {/*</ul>*/}
        </div>
      }
    </div>
  );
};
