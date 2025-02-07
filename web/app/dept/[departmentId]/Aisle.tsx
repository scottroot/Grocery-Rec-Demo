"use server"
import AisleProducts from "./AisleProducts";
import {getAisleProducts} from "@/lib/neo4j/queries/getAisleProducts";


export default async function Aisle({ aisle_id, aisle_name, }: { aisle_id: number, aisle_name: string }) {
  if(!aisle_id) return null;
  const aisle_products = await getAisleProducts(aisle_id);
  // console.log(JSON.stringify(aisle_products, null, 2));
  return (
    <li className="px-6 py-4">
      <AisleProducts title={aisle_name} products={aisle_products} />
    </li>
  );
};
