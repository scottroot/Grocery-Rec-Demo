import { graphRead } from "@/lib/neo4j/neo4j";
import { flattenProducts } from "@/lib/neo4j/flattenProducts";


/**
 * Cypher query for finding products frequently bought together **for a specific user**.
 *
 * - Computes a **weighted combination** of user and product embeddings.
 * - Uses **vector similarity search** to find similar users.
 * - Recommends products frequently purchased by those similar users.
 */
const BOUGHT_TOGETHER_WITH_USER_ID_QUERY: string = `
  WITH 
    $user_id AS user_id, 
    $product_ids AS product_ids, 
    0.5 AS alpha, 
    5 AS num_similar_users, 
    3 AS num_recommendations
  MATCH (u:User {user_id: user_id})-[:HAS_EMBEDDING]->(ue:UserEmbedding)
  MATCH (p:Product)
  WHERE p.product_id IN product_ids
  WITH u, ue.embedding AS user_embedding, COLLECT(p.embedding) AS product_embeddings, alpha AS alpha, user_id, product_ids
  
  // Compute the average product embedding
  WITH u, user_id, product_ids, user_embedding, alpha, 
       [i IN range(0, size(product_embeddings[0])-1) | 
          reduce(sum = 0.0, emb IN product_embeddings | sum + emb[i]) / size(product_embeddings)
       ] AS avg_product_embedding
  
  // Weighted combination of user and product embeddings
  WITH u, user_id, product_ids, 
       [i IN range(0, size(user_embedding)-1) | 
          (alpha * user_embedding[i]) + ((1 - alpha) * avg_product_embedding[i])
       ] AS combined_embedding
  
  // Step 1: Find Similar Users Based on Combined Embedding
  CALL db.index.vector.queryNodes('user_embedding_index', 10, combined_embedding) 
  YIELD node AS ue, score
  
  // Step 4: Ensure the user has an embedding relationship
  MATCH (similar_user:User)-[:HAS_EMBEDDING]->(ue)
  WHERE similar_user.user_id <> user_id
  
  // Step 2: Aggregate Products Purchased by Similar Users
  MATCH (similar_user)-[:PLACED]->(:Order)-[:CONTAINS]->(recommended:Product)
  WHERE NOT recommended.product_id IN product_ids
  
  // Step 3: Rank Products by Popularity Among Similar Users
  RETURN recommended.product_id AS productId, 
         recommended.product_name AS productName, 
         COUNT(*) AS purchaseCount,
         SUM(score) AS score
  ORDER BY score DESC, purchaseCount DESC
  LIMIT 5;
`;

/**
 * Cypher query for finding products frequently bought together **without user context**.
 *
 * - Computes an **average embedding** for the input products.
 * - Uses **vector similarity search** to find users who purchased similar products.
 * - Recommends the **most frequently bought products** among those users.
 */
const BOUGHT_TOGETHER_NO_USER_ID_QUERY: string = `
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
 * Fetches LLM-enhanced product recommendations based on items frequently bought together.
 *
 * - If a `userId` is provided, it **personalizes recommendations** using the user's embedding.
 * - If `userId` is **not provided**, it finds **general recommendations** based on product embeddings.
 * - Uses Neo4j's **vector similarity search** and co-purchase data.
 * - Returns **a list of recommended products** ranked by relevance.
 *
 * @param ids - An array of product IDs to base recommendations on.
 * @param userId - The user's ID for personalized recommendations (optional).
 * @param limit - The maximum number of recommended products to return (default: 5).
 * @returns A promise resolving to an array of recommended products.
 * @throws Throws an error if the query execution fails.
 */
export async function aiGetBoughtTogether(ids: number[], userId: number, limit: number = 5) {
  try {
    // Define query parameters
    const params = { product_ids: ids, alpha: 0.2, user_id: userId, limit };

    // Select appropriate query based on userId presence
    const query = userId ? BOUGHT_TOGETHER_WITH_USER_ID_QUERY : BOUGHT_TOGETHER_NO_USER_ID_QUERY;

    // Execute the query in Neo4j
    const response = await graphRead(query, params);

    // If userId query was used, return raw response TODO: revise queries so both versions return same structure and format
    if (userId) return response;

    // Otherwise, flatten recommendations from multiple users
    const topProducts = response.map(u => u.top_products);
    return flattenProducts(topProducts);
  } catch (error) {
    console.error(`Error fetching bought-together recommendations for products=${JSON.stringify(ids)}, userId=${userId}, limit=${limit}:`, error);
    throw error;
  }
}
