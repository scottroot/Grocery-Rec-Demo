import ProductGrid from "@/components/ProductGrid";
import {vectorSearch} from "@/lib/neo4j/queries/vectorSearch";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function SearchPage({ searchParams, }: { searchParams: SearchParams }) {
  const query = (await searchParams).query as string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let results: null | any[] = null;
  if(query) {
    results = await vectorSearch(query);
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
