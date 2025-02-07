import {Aisle, Department} from "@/types";
import {graphRead} from "../neo4js";
import toTitleCase from "@/utils/toTitleCase";


export async function getDepartments(): Promise<Department[]> {
  const query = `
    MATCH (d:Department)<-[:PART_OF]-(a:Aisle)
    RETURN d.department_id AS departmentId,
          d.department_name AS departmentName,
          COLLECT({ aisleId: a.aisle_id, aisleName: a.aisle_name }) AS aisles
  `;
  try {
    const result = await graphRead(query);
    // console.log(result)
    // return result.map(d => {
    //   const department_id = d.department_id.low;
    //   const department_name = toTitleCase(d.department_name);
    //   const slug = d.department_name.replaceAll(" ", "-");
    //   const aisles = d.aisles.map((a: Aisle & {aisle_id: {low: number}}) => ({
    //     ...a,
    //     aisle_name: toTitleCase(a.aisle_name),
    //     aisle_id: a.aisle_id.low
    //   }))
    //   return { ...d, department_id, department_name, slug, aisles}
    // }) as Department[];
    return result as Department[];
  } catch (error) {
    console.error("Error during aggregation:", error);
    // throw error;
    return []
  }
}
