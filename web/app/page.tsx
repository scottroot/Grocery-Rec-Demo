import { Suspense } from "react";
import WelcomeBanner from "@/components/WelcomeBanner";
import DepartmentsGrid from "@/app/Departments";


export default async function Page() {
  return (
    <div
      className="grid grid-rows-[auto_1fr_auto] p-8 pb-20 items-center justify-items-center min-h-screen font-sans"
    >
      <Suspense fallback={null}>
        <WelcomeBanner />
      </Suspense>
      <main id="browse-departments" className="flex flex-col gap-8 row-start-2 items-center sm:items-start pt-16">
        <DepartmentsGrid />
      </main>
    </div>
  );
}
