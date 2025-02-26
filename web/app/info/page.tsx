import Link from "next/link";
import Image from "next/image";


const datasetStats = [
    { id: 1, name: "Orders", value: "3.4 million" }, // 3421083
    { id: 2, name: "Users", value: "206,209" }, // 206209
    { id: 3, name: "Products", value: "49,688" },
  ]

function DatasetStats() {
  return (
    <section className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <div className="text-center">
            <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              Based on the Instacart grocery basket dataset.
            </h2>
            <p className="mt-4 text-lg/8 text-gray-600">
              {/*That data has been transformed into an interactive demo.*/}
              This interactive demo has been built with that data:
            </p>
          </div>
          {/*<dl className="mt-8 grid grid-cols-1 gap-2 overflow-hidden rounded-2xl text-center sm:grid-cols-3">*/}
          {/*  {stats.map((stat) => (*/}
          {/*    <div key={stat.id} className="flex flex-col bg-gray-100 p-4">*/}
          {/*      <dt className="text-sm/6 font-semibold text-gray-600">{stat.name}</dt>*/}
          {/*      <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>*/}
          {/*    </div>*/}
          {/*  ))}*/}
          {/*</dl>*/}
        </div>
      </div>
    </section>
  )
}

// function WelcomeMessage() {
//   return (
//     <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-md text-gray-800 max-w-3xl mx-auto">
//       <h2 className="text-2xl font-semibold text-center text-blue-900">
//         Explore personalized grocery recommendations.
//       </h2>
//       {/*<p className="mt-4 text-center">*/}
//       {/*  This demo is based on the large Instacart grocery dataset. You can browse grocery departments and add items to your cart.*/}
//       {/*</p>*/}
//       <p className="mt-4 text-center">
//         You can browse grocery departments and add items to your cart.
//       </p>
//       <ul className="mt-4 space-y-2 text-center">
//         <li>🛒 The <strong>cart icon</strong> (top right) will turn <span className="text-red-600 font-semibold">red</span> when you add items.</li>
//         <li>🔄 Visit the <strong>cart page</strong> to see AI-powered product recommendations.</li>
//         <li>👤 Click the <strong>user avatar</strong> (top right) to <strong>switch users</strong> and explore different recommendation perspectives.</li>
//       </ul>
//     </div>
//   )
// }


function Semi({children}) {
  return <span className="font-semibold">{children}</span>;
}

function Medium({children}) {
  return <span className="font-medium">{children}</span>;
}

export default async function Page() {
  return (
    <div
      className="grid grid-rows-auto items-center justify-items-center
      p-8 pb-20 gap-16 sm:p-20 font-sans"
    >
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-8 text-gray-900">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          About This Demo
        </h1>

        <section id="what-is-this">
          <h2 className="text-2xl font-semibold text-gray-800">What is This?</h2>
          <p className="mt-2 text-lg text-gray-800">
            This is a fully interactive demo of different <Semi>grocery cart recommendation</Semi> strategies. <br />
            {/*<p className="mt-4 text-center">*/}
            You can browse grocery departments and add items to your cart.
          </p>
          <ul className="mt-4 text-left list-disc list-inside text-gray-800">
            <li className="text-lg font-semibold mb-1">Browse or find grocery items</li>
            <div className="flex flex-col pl-8 gap-4  mb-4 text-gray-700">
              <div className="inline-flex items-start gap-2">
                <span className="w-72 max-w-[50%]">
                  Browse by department
                </span>
                <Image className="p-2 rounded shadow-lg border-2 border-gray-200" src="/info/browse.png" alt="browse" width={100} height={100} />
              </div>
              <div className="inline-flex items-start gap-2">
                <span className="w-72 max-w-[50%]">
                  Search by name
                </span>
                <Image className="p-2 rounded shadow-lg border-2 border-gray-200" src="/info/search.png" alt="browse" width={200} height={30} />
              </div>
            </div>
            <li className="text-lg font-semibold mb-1">Add items to your cart</li>
            <div className="flex flex-col pl-8 gap-4 mb-4 text-gray-700">
              <div className="inline-flex items-start gap-2">
                <span className="w-72 max-w-[50%]">
                  Click add to cart
                </span>
                <Image className="p-2 rounded shadow-lg border-2 border-gray-200" src="/info/add-to-cart.png" alt="browse" width={100} height={100} />
              </div>
            </div>

            <li className="text-lg font-semibold mb-1">Check your cart</li>
            <div className="flex flex-col pl-8 gap-4 mb-4 text-gray-700">
              <div className="inline-flex items-start gap-2">
                <span className="w-72 max-w-[50%]">
                  Click on cart icon (top right) - red indicator shows items added.
                </span>
                <Image className="p-2 rounded shadow-lg border-2 border-gray-200" src="/info/items-in-cart.png" alt="browse" width={60} height={60} />
              </div>
              <div className="inline-flex items-start gap-2">
                <span className="w-72 max-w-[50%]">
                  Review items in cart
                </span>
                <Image className="p-2 rounded shadow-lg border-2 border-gray-200" src="/info/shopping-cart.png" alt="browse" width={250} height={100} />
              </div>
              <div className="inline-flex items-start gap-2">
                <span className="w-72 max-w-[50%]">
                  Review recommended items
                </span>
                <Image className="p-2 rounded shadow-lg border-2 border-gray-200" src="/info/recommendations.png" alt="browse" width={250} height={100} />
              </div>
            </div>

            <li className="text-lg font-semibold mb-1">View different recommendations</li>
            <div className="flex flex-col pl-8 gap-4 mb-4 text-gray-700">
              <div className="inline-flex items-start gap-2">
                <span className="w-72 max-w-[50%]">
                  Click the recommendation toggle to change method (Graph vs LLM)
                </span>
                <Image className="p-2 rounded shadow-lg border-2 border-gray-200" src="/info/toggle.png" alt="browse" width={350} height={60} />
              </div>
            </div>
          </ul>
        </section>

        <hr className="border-gray-200 py-4" />

        <section id="about-the-data">
          <h2 className="text-2xl font-semibold text-gray-800">Brief tech overview</h2>
          <p className="mt-2 text-lg text-gray-700">
            This demo has been built with the following:
          </p>
          <ul className="mt-2 mb-6 space-y-3 text-lg list-disc list-inside">
            <li>Large dataset from Instacart</li>
            <li>Graph-based collaborative filtering using Neo4j running in AWS EC2</li>
            <li>Vector embeddings for efficient product and user search using lightweight, cost-effective BERT models from Sentence-Transformers</li>
            <li>NextJS + Tailwind + Typescript for simple front-end web app</li>
          </ul>
          <Link
            href="https://github.com/scottroot/Grocery-Rec-Demo/tree/main/web"
            className="mt-6 bg-black/80 hover:bg-black/90 transition-opacity rounded-md px-3 py-1 text-white text-base font-semibold"
          >
            View GitHub repository here
          </Link>
        </section>

        <hr className="border-gray-200 py-4" />

        <section id="about-the-data">
          <h2 className="text-2xl font-semibold text-gray-800">About the dataset</h2>
          <p className="mt-2 text-lg text-gray-700">
            Based on the <Semi>Instacart grocery basket dataset</Semi>, this interactive demo has been built with that data:
          </p>
          <dl className="mt-8 grid grid-cols-1 gap-2 overflow-hidden rounded-2xl text-center sm:grid-cols-3">
            {datasetStats.map((stat) => (
              <div key={stat.id} className="flex flex-col bg-gray-100 p-4">
                <dt className="text-sm/6 font-semibold text-gray-600">{stat.name}</dt>
                <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">{stat.value}</dd>
            </div>
            ))}
          </dl>
        </section>

        {/*TODO: clean up how-it-works section or get rid of it*/}
        {/*    <section id="how-it-works">*/}
        {/*      <h2 className="text-2xl font-semibold text-gray-800">How It Works</h2>*/}
        {/*      <ul className="mt-2 space-y-3 text-lg text-gray-700 list-disc list-inside">*/}
        {/*        <li>*/}
        {/*          <strong>Search & Browse</strong> – Explore grocery products by{" "}*/}
        {/*          <strong>searching by name or description</strong> or{" "}*/}
        {/*          <strong>browsing aisles and departments</strong>.*/}
        {/*        </li>*/}
        {/*        <li>*/}
        {/*          <strong>Personalized Recommendations</strong> – As you add items to*/}
        {/*          your cart, the system <strong>immediately suggests</strong> additional products based on:*/}
        {/*          <ul className="ml-5 space-y-1 list-disc list-inside">*/}
        {/*            <li>*/}
        {/*              <strong>Graph Collaborative Filtering</strong> – Finds products*/}
        {/*              frequently purchased together.*/}
        {/*            </li>*/}
        {/*            <li>*/}
        {/*              <strong>Product Embeddings</strong> – Uses AI to recommend*/}
        {/*              similar or complementary items based on product names.*/}
        {/*            </li>*/}
        {/*            <li>*/}
        {/*              <strong>User Embeddings</strong> – Generates deeper insights*/}
        {/*              into customer preferences.*/}
        {/*            </li>*/}
        {/*          </ul>*/}
        {/*        </li>*/}
        {/*      </ul>*/}
        {/*    </section>*/}

        {/*TODO: clean up user-modes section or get rid of it*/}
        {/*    <section id="user-modes">*/}
        {/*      <h2 className="text-2xl font-semibold text-gray-800">*/}
        {/*        Guest Mode & Historic Users*/}
        {/*      </h2>*/}
        {/*      <ul className="mt-2 space-y-3 text-lg text-gray-700 list-disc list-inside">*/}
        {/*        <li>*/}
        {/*          <strong>First-time visitors</strong> are automatically logged in as*/}
        {/*          a <strong>Guest user (User #0)</strong>, meaning recommendations are*/}
        {/*          solely based on their <strong>current cart contents</strong>.*/}
        {/*        </li>*/}
        {/*        <li>*/}
        {/*          <strong>Switching to Historic Users</strong> – Under the{" "}*/}
        {/*          <strong>Account menu</strong>, you can select a{" "}*/}
        {/*          <strong>real Instacart user from the dataset</strong>, allowing*/}
        {/*          recommendations to be influenced by both your{" "}*/}
        {/*          <strong>current cart</strong> and your{" "}*/}
        {/*          <strong>past purchase history</strong>.*/}
        {/*        </li>*/}
        {/*      </ul>*/}
        {/*    </section>*/}

        {/*TODO: clean up user-personas section or get rid of it*/}
        {/*    <section id="user-personas">*/}
        {/*      <h2 className="text-2xl font-semibold text-gray-800">*/}
        {/*        User Personas (AI-Generated Insights)*/}
        {/*      </h2>*/}
        {/*      <p className="mt-2 text-lg text-gray-700">*/}
        {/*        Each user has a <strong>persona page</strong>, where a written*/}
        {/*        description of their shopping habits is{" "}*/}
        {/*        <strong>AI-generated using ChatGPT</strong> based on their past*/}
        {/*        orders. This provides a <strong>human-readable</strong> way to*/}
        {/*        understand customer behavior patterns.*/}
        {/*      </p>*/}
        {/*    </section>*/}

        {/*TODO: clean up Call to Action section or get rid of it*/}
        {/*  /!* Call to Action *!/*/}
        {/*  <div className="mt-10">*/}
        {/*    <h2 className="text-2xl font-semibold text-gray-800">*/}
        {/*      Try It Out!*/}
        {/*    </h2>*/}
        {/*    <p className="mt-2 text-lg text-gray-700">*/}
        {/*      - <strong>Browse products</strong>, <strong>add items to your cart</strong>, and see{" "}*/}
        {/*      <strong>real-time recommendations</strong>.<br />*/}
        {/*      - <strong>Switch users</strong> to experience different recommendation styles.<br />*/}
        {/*      - <strong>Check the persona page</strong> to explore AI-generated customer insights.*/}
        {/*    </p>*/}
        {/*    <div className="mt-6">*/}
        {/*      <Link*/}
        {/*        href="/"*/}
        {/*        className="inline-block rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white hover:bg-indigo-700"*/}
        {/*      >*/}
        {/*        Go to the Demo*/}
        {/*      </Link>*/}
        {/*    </div>*/}
        {/*  </div>*/}
      </div>
    </div>
  )
}
