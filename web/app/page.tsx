import DepartmentsGrid from "@/app/Departments";


const stats = [
  { id: 1, name: 'Orders', value: '3.4 million' }, // 3421083
  { id: 2, name: 'Users', value: '206,209' }, // 206209
  { id: 3, name: 'Products', value: '49,688' },
]


export default async function Page() {
  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center
      min-h-screen p-8 pb-20 gap-16 sm:p-20
      font-[family-name:var(--font-geist-sans)]"
    >
      <section className="w-full mt-16 ">
        <div className="bg-white xpy-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:max-w-none">
              <dl className="grid grid-cols-1 gap-2 overflow-hidden rounded-2xl text-center sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.id} className="flex flex-col bg-gray-400/5 p-4">
                    <dt className="text-sm/6 font-semibold text-gray-600">{stat.name}</dt>
                    <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <DepartmentsGrid />
        {/*{query*/}
        {/*  ?*/}
        {/*  <ResultsGrid results={results} />*/}
        {/*  :*/}
        {/*  <DepartmentsGrid />*/}
        {/*}*/}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
