import { graphRead } from "@/lib/neo4j/neo4j";
import { flattenProducts } from "@/lib/neo4j/flattenProducts";


const GET_SIMILAR_USER_PRODUCTS_QUERY: string = `
  WITH $product_ids AS product_ids
  MATCH (p:Product)
  WHERE p.product_id IN product_ids
  WITH COLLECT(p.embedding) AS product_embeddings
  
  // Step 2: Compute average embedding
  WITH [i IN range(0, size(product_embeddings[0]) - 1) | 
       reduce(sum = 0.0, emb IN product_embeddings | sum + emb[i]) / size(product_embeddings)
  ] AS avg_embedding
  
  // Step 3: Find the most similar users using vector search
  CALL db.index.vector.queryNodes('user_embedding_index', 3, avg_embedding) 
  YIELD node AS ue, score
  
  // Step 4: Ensure the user has an embedding relationship
  MATCH (u:User)-[:HAS_EMBEDDING]->(ue)
  
  // Step 5: Get the top 2 most purchased products for each similar user
  MATCH (u)-[:PLACED]->(:Order)-[:CONTAINS]->(p:Product)
  WITH u, p, COUNT(*) AS purchase_count, score
  ORDER BY score DESC, purchase_count DESC
  WITH u, COLLECT({productId: p.product_id, productName: p.product_name, count: purchase_count})[..2] AS top_products
  
  // Step 6: Return results
  RETURN u.user_id AS user_id, top_products;
`;

/**
 * Retrieves product recommendations based on similar users' purchase history.
 *
 * - Computes an **average product embedding** from the input product IDs.
 * - Uses **vector search** to find the most similar users based on their embeddings.
 * - Fetches the **top 2 most purchased products** for each similar user.
 * - Flattens and returns the recommended products.
 *
 * @param ids - A single product ID or an array of product IDs to base recommendations on.
 * @param limit - The maximum number of recommendations to retrieve (default is 5).
 * @returns A promise resolving to an array of recommended `Product` objects.
 * @throws Throws an error if the query execution fails.
 */
export async function getSimilarUserProducts(ids: number|number[], limit: number = 5) {
  // Ensure `product_ids` is always an array
  const params = { limit, product_ids: Array.isArray(ids) ? ids : [ids] };

  try {
    // Execute query using Neo4j driver -- yes I know... 'any'... TODO: replace explicit any with actual return type
    const response = await graphRead(GET_SIMILAR_USER_PRODUCTS_QUERY, params) as { [p: string]: any }[];

    // Extract recommended products for similar users
    const topProducts = response.map(u => u.top_products);

    // Flatten and return product recommendations
    return flattenProducts(topProducts);
  } catch (error) {
    console.error("Error fetching similar user product recommendations:", error);
    throw error;
  }
}
