import { graphRead } from "@/lib/neo4j/neo4j";


/**
 * Cypher query for finding frequently co-purchased products for a **single product ID**.
 *
 * - Finds **orders that contain the given product**.
 * - Identifies **other products** in the same orders.
 * - Ranks products **by how often they appear together**.
 */
const BOUGHT_TOGETHER_1_PID_QUERY: string = `
  MATCH (p:Product {product_id: $product_id})<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(rec:Product)
  WHERE rec.product_id <> $product_id
  RETURN rec.product_id AS product_id, rec.product_name AS product_name, COUNT(o) AS copurchase_count
  ORDER BY copurchase_count DESC
  LIMIT 5;
`;

/**
 * Cypher query for finding frequently co-purchased products for **multiple product IDs**.
 *
 * - Finds **orders containing any of the given products**.
 * - Identifies **other products in the same orders**.
 * - Ranks products **by how often they appear in those orders**.
 */
const BOUGHT_TOGETHER_MULTI_PID_QUERY: string = `
  MATCH (o:Order)-[:CONTAINS]->(p:Product)
  WHERE p.product_id IN $product_ids
  WITH o, COUNT(DISTINCT p) AS match_count
  // WHERE match_count >= 2  // Orders with at least 2 of the 3 products
  
  MATCH (o)-[:CONTAINS]->(other:Product)
  WHERE NOT other.product_id IN $product_ids
    AND other.product_name IS NOT NULL
  
  RETURN 
      other.product_id AS product_id, 
      other.product_name AS product_name, 
      COUNT(o) AS copurchase_count,  
      COUNT(DISTINCT o) AS distinct_count  
  ORDER BY copurchase_count DESC
  LIMIT 5;
`;

/**
 * Fetches products that are frequently bought together with a given product or set of products.
 *
 * - If only **one product ID** is provided, it searches for products frequently bought **with that product**.
 * - If **multiple product IDs** are provided, it finds products frequently bought **with any of them**.
 * - Uses Neo4j to identify **co-purchased items based on order history**.
 *
 * @param ids - An array of product IDs to analyze for co-purchases.
 * @param limit - The maximum number of recommended products to return (default: 5).
 * @returns A promise resolving to an array of co-purchased products.
 * @throws Throws an error if the query execution fails.
 */
export async function stdGetBoughtTogether(ids: number[], limit: number = 5) {
  try {
    // Initialize query parameter
    let query: string;
    const params: { [p: string]: string | number | number[] } = { limit: parseInt(String(limit)) };

    // Determine which query to use based on number of input product IDs
    if (ids.length === 1) {
      params.product_id = ids[0];
      query = BOUGHT_TOGETHER_1_PID_QUERY;
    } else {
      params.product_ids = ids;
      query = BOUGHT_TOGETHER_MULTI_PID_QUERY;
    }

    // Execute the selected query in Neo4j
    const response = await graphRead(query, params);

    // Transform and return the response in a structured format
    return response.map(r => ({
      productId: r.product_id,
      productName: r.product_name,
      aisleName: r.aisle_name || null, // Ensure undefined properties don't break UI
      departmentName: r.department_name || null,
      copurchaseCount: r.copurchase_count,
      distinctCount: r.distinct_count ?? null, // Handle undefined distinctCount safely
    }));
  } catch (error) {
    console.error(`Error fetching bought-together recommendations for products=${JSON.stringify(ids)}, limit=${limit}:`, error);
    throw error;
  }
}
