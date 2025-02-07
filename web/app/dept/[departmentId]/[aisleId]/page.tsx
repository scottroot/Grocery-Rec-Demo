import Link from "next/link";
import {ArrowUturnLeftIcon} from "@heroicons/react/20/solid";
import {getAisleProducts} from "@/lib/neo4j/queries/getAisleProducts";
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
      <h1 className="text-2xl font-bold my-4">{aisle.aisleName}</h1>

      {aisle?.products &&
        <div className="overflow-hidden rounded-md bg-white shadow p-2">
          <ProductGrid items={aisle.products} />
        </div>
      }
    </div>
  );
};
