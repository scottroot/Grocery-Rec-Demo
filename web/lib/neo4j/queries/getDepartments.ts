import { graphRead } from "../neo4j";
import type { Department } from "@/types";


/**
 * Fetches all departments along with their associated aisles from Neo4j.
 *
 * - Retrieves department details and aisles using a Cypher query.
 * - Groups aisles under their respective departments.
 * - Returns an array of `Department` objects.
 *
 * @returns A promise resolving to an array of `Department` objects.
 * @throws Logs an error if the database query fails and returns an empty array.
 */
export async function getDepartments(): Promise<Department[]> {
  const query = `
    MATCH (d:Department)<-[:PART_OF]-(a:Aisle)
    RETURN d.department_id AS departmentId,
          d.department_name AS departmentName,
          COLLECT({ aisleId: a.aisle_id, aisleName: a.aisle_name }) AS aisles
  `;
  try {
    // Execute the query using the Neo4j driver
    const result = await graphRead(query);

    // If no data is found, return an empty array
    if (!result.length) return [];

    // Transform the result into an array of `Department` objects
    return result as Department[];
  } catch (error) {
    console.error("Error fetching departments:", error);
    return []
  }
}
