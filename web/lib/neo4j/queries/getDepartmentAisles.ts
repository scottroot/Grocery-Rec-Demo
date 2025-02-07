import {Aisle, Department} from "@/types";
import {graphRead} from "../neo4js";
import toTitleCase from "@/utils/toTitleCase";
import {prepare} from "@/lib/neo4j/prepare";


export async function getDepartmentAisles(departmentId: number): Promise<Department> {
  const query = `
    MATCH (d:Department {department_id: $departmentId})<-[:PART_OF]-(a:Aisle)
    RETURN d.department_id AS departmentId,
          d.department_name AS departmentName,
          COLLECT({ aisleId: a.aisle_id, aisleName: a.aisle_name }) AS aisles
  `;
  const params = {departmentId};
  // console.log(departmentId)
  try {
    const result = await graphRead(query, params);
    // console.log(JSON.stringify({departmentId, getDeptAislesResult: result}));
    // const department = prepare(result[0]) as Department;
    // console.log(result);
    return result[0] as Department
    // return department
  } catch (error) {
    console.error("Error during aggregation:", error);
    throw error;
  }
}
