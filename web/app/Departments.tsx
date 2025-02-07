import Link from "next/link";
import {getDepartments} from "@/lib/neo4j/queries/getDepartments";
import {Department} from "@/types";
import toTitleCase from "@/utils/toTitleCase";
import Image from "next/image";


const departmentOrder: string[] = [
  "produce",
  "dairy eggs",
  "meat seafood",
  "frozen",
  "pantry",
  "dry goods pasta",
  "canned goods",
  "snacks",
  "bakery",
  "breakfast",
  "deli",
  "beverages",
  "alcohol",
  "household",
  "personal care",
  "babies",
  "pets",
  "international",
  "bulk",
  "other",
  "missing",
];
const reorderDepartments = (departments: Department[]): Department[] => {
  return [...departments].sort(
    (a, b) => departmentOrder.indexOf(a.departmentName) - departmentOrder.indexOf(b.departmentName)
  );
};

export default async function DepartmentsGrid() {
  const departments = reorderDepartments(await getDepartments());

  return (
    <div className="container-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Browse Departments</h1>
      {/*<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">*/}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
        {departments.map((department: Department) => {
          const departmentName = toTitleCase(department.departmentName);
          return (
            <div
              key={department.departmentId}
              className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition break-inside-avoid"
            >
              <Link href={`/dept/${department.departmentId}`}>
                <div className="relative w-auto max-w-16 aspect-square mx-auto mb-4">
                  <Image alt={department.departmentName} src={`/${department.departmentName.replaceAll(" ", "-")}.jpg`} fill />
                </div>
              </Link>
              {/* Department Header */}
              <Link href={`/dept/${department.departmentId}`} title={`${departmentName} Department`}>
                <h2 className="text-center text-xl font-semibold text-gray-800 hover:text-blue-900 mb-3">
                  {departmentName}
                </h2>
              </Link>

              {/* Aisles List */}
              <ul className="space-y-1">
                {department?.aisles && department.aisles.sort().map((aisle, index) => {
                  const aisleName = toTitleCase(aisle.aisleName);
                  return (
                    <li key={`${aisle}_${index}`} className=" text-gray-600 hover:text-blue-800 ">
                      <Link
                        href={`/dept/${department.departmentId}/${aisle.aisleId}`}
                        title={`${aisleName} Aisle`}
                        className="flex w-full text-sm text-center"
                      >
                        <span className="truncate">{aisleName}</span>
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}