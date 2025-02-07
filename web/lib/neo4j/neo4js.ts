import {driver, isInt} from "./neo4jsDriver";
import * as neo4j from "neo4j-driver";


export async function graphRead(query: string, params: {[p: string]: string|number|string[]|number[]} = {}) {
  const { records} = await driver.executeQuery(query, params, {database: 'neo4j'})
  return records.map((r) => {
    const obj = r.toObject();
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, extractProperties(value)])
    );
  });
}

function extractProperties(value: any): any {
  if (value && typeof value === "object" && "properties" in value) {
    return convertNeo4jTypes(value.properties); // Extract properties from the node/relationship
  }
  return convertNeo4jTypes(value); // Handle standalone values
}

function convertNeo4jTypes(obj: any): any {
  if (isInt(obj)) {
    return obj.toNumber(); // Convert Neo4j Integer to JS number
  } else if (Array.isArray(obj)) {
    return obj.map(convertNeo4jTypes); // Recursively handle arrays
  } else if (typeof obj === "object" && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertNeo4jTypes(value)])
    ); // Recursively process objects
  }
  return obj; // Return other types unchanged
}