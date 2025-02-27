import { graphRead } from "../neo4j";
import toTitleCase from "@/utils/toTitleCase";
import type {Aisle, Product} from "@/types";


/**
 * Fetches all products within a given aisle from Neo4j.
 *
 * - Retrieves aisle details along with associated products.
 * - Converts product and aisle names to title case for consistency.
 * - Returns an `Aisle` object or `undefined` if no data is found.
 *
 * @param aisleId - The unique identifier of the aisle.
 * @returns A promise resolving to an `Aisle` object, or `undefined` if no products are found.
 * @throws Throws an error if the database query fails.
 */
export async function getAisleProducts(aisleId: number): Promise<Aisle | undefined> {
  try {
    const query = `
      MATCH (a:Aisle {aisle_id: $aisleId})<-[:IN_AISLE]-(p:Product)
      RETURN a.aisle_id as aisleId, a.aisle_name as aisleName, COLLECT(p) AS products
    `;

    // Execute the query using the Neo4j driver
    const result = await graphRead(query, { aisleId });

    // If no results or no products found, return undefined
    if (!result.length || !result[0].products) return;

    // Extract products and format them into a usable array
    const products: Product[] = result[0].products.map(p => ({
      productId: p.properties.product_id,
      productName: toTitleCase(p.properties.product_name),
    }));

    // Return formatted aisle details along with its products
    return {
      aisleId,
      aisleName: toTitleCase(result[0].products[0].properties.aisle_name),
      departmentId: result[0].products[0].properties.department_id,
      departmentName: toTitleCase(result[0].products[0].properties.department_name),
      products,
    }
  } catch (error) {
    console.error("Error fetching aisle products:", error);
    throw error;
  }
}
