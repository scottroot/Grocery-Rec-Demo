import type { Product } from "@/types";
import { graphRead } from "@/lib/neo4j/neo4js";


export async function textSearch(searchTerm: string, limit: number = 5): Promise<Product[]> {
  const query = `
    CALL db.index.fulltext.queryNodes("product_name_index", $searchTerm) 
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

  return await graphRead(query, {searchTerm, limit}) as Product[]
}
