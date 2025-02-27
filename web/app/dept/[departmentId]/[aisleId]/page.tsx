import ProductGrid from "@/components/ProductGrid";
import BackButton from "@/components/BackButton";
import { getAisleProducts } from "@/lib/neo4j/queries/getAisleProducts";


/**
 * Department Aisle Page
 *
 * This page dynamically fetches and displays products for a given aisle.
 * - The page is **server-side rendered (SSR)**.
 * - Fetches products from Neo4j using `getAisleProducts(aisleId)`.
 * - If the aisle or products are not found, it returns `null` (no UI).
 *
 * @param params - Route parameters, containing `aisleId` from the URL.
 * @returns The rendered page with a product grid or `null` if the aisle is not found.
 */
export default async function DepartmentPage({ params, }: { params: Promise<{ aisleId: number }>}) {
  // Extract aisleId from the route parameters and ensure it's a number
  const aisleId = Number((await params).aisleId);
  if (!aisleId) return null; // Exit early if no valid ID

  // Fetch aisle data including department name, aisle name, and products
  const aisle = await getAisleProducts(aisleId);
  if(!aisle) return null; // Exit early if no aisle data found

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton
        returnUrl="/"
        text={<>back to <span className="italic group-hover:underline mx-1.5">{aisle.departmentName}</span> department</>}
      />

      {/* Aisle title */}
      <h1 className="text-2xl font-bold my-4">{aisle.aisleName}</h1>

      {/* Render product grid if there are products */}
      {aisle?.products &&
        <div className="overflow-hidden rounded-md bg-white shadow p-2">
          <ProductGrid items={aisle.products} />
        </div>
      }
    </div>
  );
};
