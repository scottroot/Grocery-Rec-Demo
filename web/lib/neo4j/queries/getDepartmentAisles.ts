import { graphRead } from "../neo4j";
import type { Department } from "@/types";


/**
 * Fetches all aisles within a given department from Neo4j.
 *
 * - Retrieves department details along with associated aisles.
 * - Uses `graphRead` to execute the Cypher query.
 * - Returns a `Department` object containing the department name and its aisles.
 *
 * @param departmentId - The unique identifier of the department.
 * @returns A promise resolving to a `Department` object.
 * @throws Throws an error if the database query fails.
 */
export async function getDepartmentAisles(departmentId: number): Promise<Department> {
  const query = `
    MATCH (d:Department {department_id: $departmentId})<-[:PART_OF]-(a:Aisle)
    RETURN d.department_id AS departmentId,
          d.department_name AS departmentName,
          COLLECT({ aisleId: a.aisle_id, aisleName: a.aisle_name }) AS aisles
  `;
  const params = { departmentId };

  try {
    // Execute the query using the Neo4j driver
    const result = await graphRead(query, params);

    // If no department data is found, return an empty object to avoid runtime errors
    if (!result.length) throw new Error(`Department with ID ${departmentId} not found`);

    // Transform the result into a `Department` object
    return result[0] as Department;
  } catch (error) {
    console.error("Error fetching department aisles:", error);
    throw error;
  }
}
