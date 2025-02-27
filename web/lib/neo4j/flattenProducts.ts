import type { Product } from "@/types";


/**
 * Flattens a nested array of products and extracts only relevant properties.
 *
 * @param nestedArray - A two-dimensional array of Product objects.
 * @returns A one-dimensional array of Product objects containing only `productId` and `productName`.
 *
 * @example
 * const nestedProducts = [
 *   [{ productId: 1, productName: "Milk" }, { productId: 2, productName: "Bread" }],
 *   [{ productId: 3, productName: "Eggs" }]
 * ];
 *
 * const flattened = flattenProducts(nestedProducts);
 * console.log(flattened);
 * // Output: [
 * //   { productId: 1, productName: "Milk" },
 * //   { productId: 2, productName: "Bread" },
 * //   { productId: 3, productName: "Eggs" }
 * // ]
 */
export const flattenProducts = (nestedArray: Product[][]): Product[] => {
  return nestedArray
    .flat()
    .map(({ productId, productName }) => ({ productId, productName }));
};
