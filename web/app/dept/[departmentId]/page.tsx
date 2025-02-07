import Link from "next/link";
import {getDepartmentAisles} from "@/lib/neo4j/queries/getDepartmentAisles";
import toTitleCase from "@/utils/toTitleCase";


export default async function DepartmentPage({ params, }: { params: Promise<{ departmentId: number }>}) {
  const departmentId = Number((await params).departmentId);
  console.log(`Department ID: ${departmentId}`);
  if (!departmentId) return null;
  const department = await getDepartmentAisles(departmentId);
  const aisles = department?.aisles?.sort((a, b) => a.aisleName.localeCompare(b.aisleName));
  if(!aisles) return null;
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">back</Link>
      <h1 className="text-2xl font-bold mb-4">
        {toTitleCase(department?.departmentName)} ({department?.departmentId})
      </h1>
      {aisles &&
        <div className="overflow-hidden rounded-md bg-white shadow">
          <ul role="list" className="grid grid-cols-subgrid divide-y divide-gray-200">
            {aisles.map((aisle, idx) => (
              <li key={`${aisle.aisleId}_${idx}`} className="px-6 py-4">
                <Link href={`/dept/${departmentId}/${aisle.aisleId}`}>{toTitleCase(aisle.aisleName)}</Link>
              </li>
            ))}
          </ul>
        </div>
      }
    </div>
  );
};
