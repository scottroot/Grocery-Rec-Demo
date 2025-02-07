import {graphRead} from "../neo4js";
import toTitleCase from "@/utils/toTitleCase";
import {Order, Product} from "@/types";


type OrderWithDate = {
  orderId: number;
  date: string; // YYYY-MM-DD
  items: Product[]
};

function calculateOrderDates(orders: any): Order[] {

  if (orders.length === 0) return [];

  const lastDate = new Date("2024-01-01"); // First order is assumed to be Jan 1, 2024

  return orders.map((order, index) => {
    if (order?.days_since_prior_order === 0) {
      return { ...order, date: lastDate.toISOString().split("T")[0] };
    }

    if (typeof order?.days_since_prior_order === 'number') {
      lastDate.setDate(lastDate.getDate() + order.days_since_prior_order);
    }

    return { ...order, date: lastDate.toISOString().split("T")[0] };
  });
}

export async function getUserOrders(userId: number): Promise<Order[]|undefined> {
  try {
    const query = `
      MATCH (u:User {user_id: $userId})-[:PLACED]->(o:Order)-[:CONTAINS]->(p:Product)
      WITH o.order_id AS order_id, o.order_number AS order_number, u.user_id AS user_id, 
           o.days_since_prior_order AS days_since_prior_order,
           COLLECT({ productId: p.product_id, productName: p.product_name }) AS products
      RETURN order_id AS orderId, order_number AS orderNumber, days_since_prior_order, products AS items
      ORDER BY orderNumber ASC;
    `;
    const results = await graphRead(query, {userId}) as Order[]|undefined;

    if (!results?.length) return;

    const resultsWithDates = calculateOrderDates(results)
    const orders = resultsWithDates.map(o => {
      return {
        ...o,
        items: o.items.map(p => ({
          productId: p.productId,
          productName: toTitleCase(p.productName)
        }))
      }
    })
    return orders.reverse()

  } catch (error) {
    console.error("Error during aggregation:", error);
    throw error;
  }
}
