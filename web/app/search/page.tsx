import ProductGrid from "@/components/ProductGrid";
import { vectorSearch } from "@/lib/neo4j/queries/vectorSearch";
import { textSearch } from "@/lib/neo4j/queries/textSearch";
import type { SearchParams } from "@/types";


export default async function SearchPage({ searchParams, }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const query = sp.query as string|undefined;
  const doVector = sp.vector === "true";
  const limit = Number(sp.limit || 10);

  let results: null | any[] = null;
  if(query) {
    results = doVector ? await vectorSearch(query, limit) : await textSearch(query, limit);
  }
  return (
    <section className="container mx-auto max-w-7xl px-8 pb-20 gap-16 sm:p-20 sm:pt-4">
      {query &&
        <div className="my-6">
          <h1 className="text-2xl tracking-tight text-gray-900">
            Search results for <span className="font-bold">{query}</span>...
          </h1>
        </div>
      }
      <ProductGrid items={results} />
    </section>
  )
}
