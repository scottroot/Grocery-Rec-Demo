import {Aisle, Department} from "@/types";
import {graphRead} from "../neo4js";
import toTitleCase from "@/utils/toTitleCase";
import {Product} from "@/types";


export async function getAisleProducts(aisleId: number): Promise<Aisle|undefined> {
  try {
    const query = `
      MATCH (a:Aisle {aisle_id: $aisleId})<-[:IN_AISLE]-(p:Product)
      RETURN a.aisle_id as aisleId, a.aisle_name as aisleName, COLLECT(p) AS products
    `;
    const result = await graphRead(query, {aisleId});
    if (!result.length || !result[0].products) return;
    const products = result[0].products.map(p => ({
      productId: p.properties.product_id,
      productName: toTitleCase(p.properties.product_name),
    }));
    return {
      aisleId,
      aisleName: toTitleCase(result[0].products[0].properties.aisle_name),
      departmentId: result[0].products[0].properties.department_id,
      departmentName: toTitleCase(result[0].products[0].properties.department_name),
      products,
    }
  } catch (error) {
    console.error("Error during aggregation:", error);
    throw error;
  }
}
