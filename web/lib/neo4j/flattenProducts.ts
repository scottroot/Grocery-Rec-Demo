import {Product} from "@/types";


export const flattenProducts = (nestedArray: Product[][]): Product[] => {
  return nestedArray.flat().map(({ productId, productName }) => ({ productId, productName }));
};