// import {graphRead} from "@/lib/neo4j/neo4j";
//
//
// export async function getRecommendations(ids: number|number[], limit: number = 5) {
//   let query: string = "";
//   const params: {[p: string]: string|number} = { limit: parseInt(String(limit)) };
//   if(typeof ids === 'number') {
//     ids = [ids]
//   }
//   switch (ids.length) {
//     case 1:
//       console.log(`Using product length 1 - ${String(ids)}`)
//       params.product_id1 = Number(ids[0]);
//       // query = `
//       //   MATCH (p:Product {product_id: $product_id1})<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(other:Product)
//       //   WHERE other.product_id <> $product_id1 AND other.product_name IS NOT NULL
//       //   RETURN
//       //       other.product_id AS product_id,
//       //       other.product_name AS product_name,
//       //       COUNT(o) AS copurchase_count,
//       //       COUNT(DISTINCT o) AS distinct_count
//       //   ORDER BY copurchase_count DESC
//       //   LIMIT 5;`
//       query = ` // with lift
//         MATCH (p:Product {product_id: $product_id1})<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(other:Product)
//         WHERE other.product_id <> $product_id1 AND other.product_name IS NOT NULL
//
//         // Compute co-purchase count and distinct orders count
//         WITH other, COUNT(o) AS copurchase_count, COUNT(DISTINCT o) AS distinct_count
//
//         // Find how many orders contain the other product
//         MATCH (other)<-[:CONTAINS]-(other_order:Order)
//         WITH other, copurchase_count, distinct_count, COUNT(DISTINCT other_order) AS num_orders_with_other
//
//         // Apply weighted scoring to penalize globally popular items
//         WITH other, copurchase_count, distinct_count, num_orders_with_other,
//              copurchase_count * 1.0 / num_orders_with_other AS weighted_score
//
//         // Order by weighted score instead of raw co-purchase count
//         RETURN other.product_id AS product_id,
//                other.product_name AS product_name,
//                copurchase_count,
//                distinct_count,
//                weighted_score
//         ORDER BY weighted_score DESC
//         LIMIT 5;`
//       break;
//     case 2:
//       console.log(`Using product length 2 - ${ids[0]} and ${ids[1]}`)
//       params.product_id1 = Number(ids[0]);
//       params.product_id2 = Number(ids[1]);
//       query = `
//       MATCH (p1:Product {product_id: $product_id1})<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(p2:Product {product_id: $product_id2})
//         MATCH (o)-[:CONTAINS]->(other:Product)
//         WHERE other.product_id <> $product_id1
//           AND other.product_id <> $product_id2
//           AND other.product_name IS NOT NULL
//         RETURN
//             other.product_id AS product_id,
//             other.product_name AS product_name,
//             COUNT(o) AS copurchase_count,
//             COUNT(DISTINCT o) AS distinct_count
//         ORDER BY copurchase_count DESC
//         LIMIT 5;`
//       break
//     case 3:
//       console.log(`Using product length 3 - ${String(ids)}`)
//       params.product_id1 = ids[0];
//       params.product_id2 = ids[1];
//       params.product_id3 = ids[2];
//       // query = `
//       // MATCH (p1:Product {product_id: $product_id1})<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(p2:Product {product_id: $product_id2})
//       //   MATCH (o)-[:CONTAINS]->(p3:Product {product_id: $product_id3})
//       //   MATCH (o)-[:CONTAINS]->(other:Product)
//       //   WHERE other.product_id <> $product_id1
//       //     AND other.product_id <> $product_id2
//       //     AND other.product_id <> $product_id3
//       //     AND other.product_name IS NOT NULL
//       //   RETURN
//       //       other.product_id AS product_id,
//       //       other.product_name AS product_name,
//       //       COUNT(o) AS copurchase_count,
//       //       COUNT(DISTINCT o) AS distinct_count
//       //   ORDER BY copurchase_count DESC
//       //   LIMIT 5;`
//       query = `MATCH (o:Order)-[:CONTAINS]->(p:Product)
// WHERE p.product_id IN [$product_id1, $product_id2, $product_id3]
// WITH o, COUNT(DISTINCT p) AS match_count
// WHERE match_count >= 2  // Orders with at least 2 of the 3 products
//
// MATCH (o)-[:CONTAINS]->(other:Product)
// WHERE NOT other.product_id IN [$product_id1, $product_id2, $product_id3]
//   AND other.product_name IS NOT NULL
//
// RETURN
//     other.product_id AS product_id,
//     other.product_name AS product_name,
//     COUNT(o) AS copurchase_count,
//     COUNT(DISTINCT o) AS distinct_count
// ORDER BY copurchase_count DESC
// LIMIT 5;`
//       break
//     case 4:
//       console.log(`Using product length 4 - ${String(ids)}`)
//       params.product_id1 = ids[0];
//       params.product_id2 = ids[1];
//       params.product_id3 = ids[2];
//       params.product_id4 = ids[3];
//       query = `
//       MATCH (p1:Product {product_id: $product_id1})<-[:CONTAINS]-(o:Order)-[:CONTAINS]->(p2:Product {product_id: $product_id2})
//         MATCH (o)-[:CONTAINS]->(p3:Product {product_id: $product_id3})
//         MATCH (o)-[:CONTAINS]->(p4:Product {product_id: $product_id4})
//         MATCH (o)-[:CONTAINS]->(other:Product)
//         WHERE other.product_id <> $product_id1
//           AND other.product_id <> $product_id2
//           AND other.product_id <> $product_id3
//           AND other.product_id <> $product_id4
//           AND other.product_name IS NOT NULL
//         RETURN
//             other.product_id AS product_id,
//             other.product_name AS product_name,
//             other.aisle_name as aisle_name,
//             other.department_name as department_name,
//             COUNT(o) AS copurchase_count,
//             COUNT(DISTINCT o) AS distinct_count
//         ORDER BY copurchase_count DESC
//         LIMIT 5;`
//       break
//   }
//   console.log(JSON.stringify({query, ids}))
//
//   const response = await graphRead(query, params);
//   console.log(JSON.stringify({didItWork: "dunno", response}));
//   return response.map(r => ({
//     productId: r.product_id,
//     productName: r.product_name,
//     aisleName: r.aisle_name,
//     departmentName: r.department_name,
//     copurchaseCount: r.copurchase_count,
//     distinctCount: r.distinct_count,
//   }))
// }
