"use server";
import type {Product} from "@/types";
import {graphRead} from "@/lib/neo4j/neo4js";


export async function vectorSearch(searchTerm: string, limit: number = 5): Promise<Product[]> {
  const url = `${process.env.INFERENCE_URI}/?query=${encodeURI(searchTerm)}`;
  // console.log(JSON.stringify({url}));
  const queryVector = await fetch(url).then(res => res.json().then(r => r.embedding));
  // console.log(`queryVector length = ${queryVector.length}`);
  // console.log(typeof queryVector[0]);
  const query = `
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

  const results = await graphRead(query, {queryVector, limit}) as Product[]

  // console.log(results)
  return results
}