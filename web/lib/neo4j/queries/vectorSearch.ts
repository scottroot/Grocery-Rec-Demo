import { graphRead } from "@/lib/neo4j/neo4j";
import type { Product } from "@/types";


const VECTOR_SEARCH_QUERY: string = `
  CALL db.index.vector.queryNodes('product_embedding_index', $limit, $queryVector)
  YIELD node, score
  RETURN  node.product_id as productId, 
          node.product_name as productName, 
          node.aisle_id as aisleId, 
          node.aisle_name as aisleName, 
          node.department_id as departmentId,
          node.department_name as departmentName
  ORDER BY score DESC;
`;

/**
 * Performs a **vector-based search** for similar products using a query embedding.
 *
 * - Calls an **external inference API** (`INFERENCE_URI`) to get an embedding for `searchTerm`.
 * - Uses Neo4j's **vector search** to find the most similar products.
 * - Returns product details sorted by similarity score.
 *
 * @param searchTerm - The text input used to generate a query vector.
 * @param limit - The maximum number of search results to return (default: 5).
 * @returns A promise resolving to an array of `Product` objects ranked by similarity.
 * @throws Throws an error if the external API call or Neo4j query fails.
 */
export async function vectorSearch(searchTerm: string, limit: number = 5): Promise<Product[]> {
  try {
    // Construct API request URL for getting query embedding
    const url = `${process.env.INFERENCE_URI}/?query=${encodeURIComponent(searchTerm.toLowerCase())}`;

    // Fetch query vector from the external inference API
    const queryVector = await fetch(url)
      .then(res => res.json())
      .then(r => r.embedding);

    // Validate that queryVector is an array (avoiding API response issues)
    if (!Array.isArray(queryVector)) {
      throw new Error(`Invalid query vector received: ${JSON.stringify(queryVector)}`);
    }

    // Execute the vector search query in Neo4j
    return (await graphRead(VECTOR_SEARCH_QUERY, { queryVector, limit })) as Product[];
  } catch (error) {
    console.error(`Error performing vector search for searchTerm="${searchTerm}" with limit=${limit}:`, error);
    throw error;
  }
}