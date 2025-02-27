import { graphRead } from "../neo4j";
import toTitleCase from "@/utils/toTitleCase";
import type { Order, Product } from "@/types";


const USER_ORDERS_QUERY: string = `
  MATCH (u:User {user_id: $userId})-[:PLACED]->(o:Order)-[:CONTAINS]->(p:Product)
  WITH o.order_id AS order_id, o.order_number AS order_number, u.user_id AS user_id, 
       o.days_since_prior_order AS days_since_prior_order,
       COLLECT({ productId: p.product_id, productName: p.product_name }) AS products
  RETURN order_id AS orderId, order_number AS orderNumber, days_since_prior_order, products AS items
  ORDER BY orderNumber ASC;
`;

/**
 * Assigns order dates based on `days_since_prior_order` values.
 *
 * - Assumes the first order date is `2024-01-01`.
 * - Computes subsequent order dates based on `days_since_prior_order`.
 * - Returns an array of `Order` objects with calculated `date` fields.
 *
 * @param orders - Array of orders with `days_since_prior_order` values.
 * @returns An array of orders with computed `date` fields.
 */
function calculateOrderDates(orders: Order[]): Order[] {
  if (orders.length === 0) return [];

  const lastDate = new Date("2024-01-01"); // First order is assumed to be Jan 1, 2024

  return orders.map((order) => {
    if (order?.days_since_prior_order === 0) {
      return { ...order, date: lastDate.toISOString().split("T")[0] };
    }

    if (typeof order?.days_since_prior_order === "number") {
      lastDate.setDate(lastDate.getDate() + order.days_since_prior_order);
    }

    return { ...order, date: lastDate.toISOString().split("T")[0] };
  });
}

/**
 * Fetches a user's past orders along with the products they contain.
 *
 * - Retrieves all orders placed by a user and their associated products.
 * - Orders are sorted in ascending order based on order number.
 * - Uses `calculateOrderDates()` to assign human-readable dates to orders.
 * - Formats product names using `toTitleCase()`.
 * - Returns the orders in **reverse chronological order** (newest first).
 *
 * @param userId - The unique identifier of the user.
 * @returns A promise resolving to an array of `Order` objects or `undefined` if no orders are found.
 * @throws Throws an error if the query execution fails.
 */
export async function getUserOrders(userId: number): Promise<Order[] | undefined> {
  try {
    // Execute query using Neo4j driver
    const results = (await graphRead(USER_ORDERS_QUERY, { userId })) as Order[] | undefined;

    // If no orders are found, return undefined
    if (!results?.length) return;

    // Compute order dates based on `days_since_prior_order`
    const resultsWithDates = calculateOrderDates(results);

    return resultsWithDates
      .map((o) => ({
        ...o,
        items: o.items.map((p) => ({
          productId: p.productId,
          productName: toTitleCase(p.productName),
        })),
      }))
      .reverse(); // Return newest orders first
  } catch (error) {
    console.error(`Error fetching orders for userId=${userId}:`, error);
    throw error;
  }
}
