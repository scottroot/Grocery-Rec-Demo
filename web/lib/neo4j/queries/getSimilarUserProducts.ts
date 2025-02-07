import {graphRead} from "@/lib/neo4j/neo4js";
import {Product} from "@/types";

const flattenProducts = (nestedArray: Product[][]): Product[] => {
  return nestedArray.flat().map(({ productId, productName }) => ({ productId, productName }));
};

export async function getSimilarUserProducts(ids: number|number[], limit: number = 5) {
  const query: string = `
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
  const params = { limit, product_ids: Array.isArray(ids) ? ids : [ids] };

  const response = await graphRead(query, params!) as {[p: string]: any}[];

  const topProducts = response.map(u => u.top_products);
  // const recommendations = flattenProducts(topProducts);
  // console.log(recommendations)
  return flattenProducts(topProducts);
  // (r => r.top_products))
  // return response.map(r => ({
  //   productId: r.product_id,
  //   productName: r.product_name,
  //   // aisleName: r.aisle_name,
  //   // departmentName: r.department_name,
  //   // copurchaseCount: r.copurchase_count,
  //   // distinctCount: r.distinct_count,
  // }))
}
