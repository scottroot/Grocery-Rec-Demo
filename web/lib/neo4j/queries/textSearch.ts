import { graphRead } from "@/lib/neo4j/neo4j";
import type { Product } from "@/types";


/**
 * Full-text search query for products using Neo4j's full-text index.
 *
 * - Uses **`CALL db.index.fulltext.queryNodes`** to find matching product names.
 * - Converts the search term to **lowercase** to ensure case-insensitive search.
 * - Retrieves **product details**, including aisle and department information.
 * - Results are sorted **by relevance score in descending order**.
 * - Limits the number of returned results based on `$limit`.
 *
 *  @param searchTerm - The term to search for in product names
 *  @param limit - The maximum number of search results to return (default: 5).
 */
const TEXT_SEARCH_QUERY: string = `
  CALL db.index.fulltext.queryNodes("product_name_index", toLower($searchTerm))
  YIELD node, score
  RETURN  node.product_id as productId, 
      node.product_name as productName, 
      node.aisle_id as aisleId, 
      node.aisle_name as aisleName, 
      node.department_id as departmentId,
      node.department_name as departmentName
  ORDER BY score DESC
  LIMIT toInteger($limit);
`;

/**
 * Performs a full-text search for products based on a search term.
 *
 * - Uses Neo4j's **full-text index** to find matching product names.
 * - Results are **sorted by relevance score** (highest first).
 * - Limits the number of returned products (default: 5).
 *
 * @param searchTerm - The term to search for in product names.
 * @param limit - The maximum number of search results to return (default: 5).
 * @returns A promise resolving to an array of `Product` objects matching the search term.
 * @throws Throws an error if the query execution fails.
 */
export async function textSearch(searchTerm: string, limit: number = 5): Promise<Product[]> {
  try {
    // Execute full-text search query using Neo4j
    return (await graphRead(TEXT_SEARCH_QUERY, { searchTerm, limit })) as Product[];
  } catch (error) {
    console.error(`Error performing text search for searchTerm="${searchTerm}" with limit=${limit}:`, error);
    throw error;
  }
}
