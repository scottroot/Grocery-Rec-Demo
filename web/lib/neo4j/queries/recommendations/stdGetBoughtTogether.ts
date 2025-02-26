import { graphRead } from "@/lib/neo4j/neo4js";


export async function stdGetBoughtTogether(ids: number[], limit: number = 5) {
  let query: string;
  const params: {[p: string]: string|number|number[]} = { limit: parseInt(String(limit)) };

  if(ids.length === 1) {
    params.product_id = ids[0]
    query = `
      MATCH (p:Product {product_id: $product_id})<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(rec:Product)
      WHERE rec.product_id <> $product_id
      RETURN rec.product_id AS product_id, rec.product_name AS product_name, COUNT(o) AS copurchase_count
      ORDER BY copurchase_count DESC
      LIMIT 5;`
  }
  else {
    params.product_ids = ids
    query = `MATCH (o:Order)-[:CONTAINS]->(p:Product)
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
      LIMIT 5;`
  }

  const response = await graphRead(query, params);

  console.log(JSON.stringify({response}))

  return response.map(r => ({
    productId: r.product_id,
    productName: r.product_name,
    aisleName: r.aisle_name,
    departmentName: r.department_name,
    copurchaseCount: r.copurchase_count,
    distinctCount: r.distinct_count,
  }))
}
