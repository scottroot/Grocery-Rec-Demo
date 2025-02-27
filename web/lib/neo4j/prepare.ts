/**
 * Converts Neo4j integer objects to native JavaScript numbers when applicable.
 *
 * @param obj - An object with properties that may contain Neo4j integer values.
 * @returns A new object with Neo4j integer properties converted to standard numbers.
 *
 * @example
 * const neo4jObj = { count: { low: 42, high: 0 }, name: "Product A" };
 * const result = prepare(neo4jObj);
 * console.log(result);
 * // Output: { count: 42, name: "Product A" }
 */
export function prepare(obj: {[p: string|number]: any}) {
  try {
    return Object.keys(obj).reduce((agg, curr) => {
      if (typeof obj[curr] === "object" && obj[curr] !== null && "low" in obj[curr]) {
        // Extracts `low` property that neo4j driver insists on giving us for integer object
        return { ...agg, [curr]: obj[curr].low };
      }
      return { ...agg, [curr]: obj[curr] };
    }, {});
  } catch (error) {
    console.error("Error in prepare function:", JSON.stringify(obj), error);
    return obj;
  }
}
