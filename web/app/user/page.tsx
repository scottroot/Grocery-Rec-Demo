import Image from "next/image";
import {graphRead} from "@/lib/neo4j/neo4js";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import {getIronSession} from "iron-session";
import {SessionData, sessionOptions} from "@/lib/session";
import {cookies} from "next/headers";
import Link from "next/link";


const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME!;
const S3_REGION = process.env.S3_REGION!;
const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});


export default async function Page() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const userId = session.userId;
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: S3_BUCKET_NAME,
      Key: `${userId}.json`,
    }),
  );

  if(!response) {
    return (
      <div className="text-center">
        <p className="text-base font-semibold text-indigo-600">404</p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
          User not found
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
          Sorry, we couldn&apos;t find a profile for this user.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/user/orders"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            You can still view the user&apos;s order history here.
          </Link>
          <a href="#" className="text-sm font-semibold text-gray-900">
            Contact support <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    )
  }
  const str = await response.Body?.transformToString();
  // console.log(str)
  // const cleanedString = str?.replace(/\n/g, "").replace(/\r/g, "");

  const p = JSON.parse(str!).user_persona;
  // console.log(JSON.stringify(p, null, 4));

  return (
    <div
      className="xgrid
      xgrid-rows-[20px_1fr_20px] items-center justify-items-center
      xmin-h-screen p-8 pb-20 gap-16 sm:p-20
      font-[family-name:var(--font-geist-sans)]"
    >
      <div className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          User personas are AI-generated based on the user ID&apos;s past orders.
        </div>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

        <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">User Persona: &quot;{p.name}&quot;</h1>

          {/*Demographics Section*/}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Demographics</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2">
                <li><strong>Age:</strong> {p.demographics.age}</li>
                <li><strong>Occupation:</strong> {p.demographics.occupation}</li>
                <li><strong>Location:</strong> {p.demographics.location}</li>
                <li><strong>Household:</strong> {p.demographics.household}</li>
                <li><strong>Income Level:</strong> {p.demographics.income_level}</li>
            </ul>
        </div>

          {/*Shopping Behavior & Lifestyle*/}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Shopping Behavior & Lifestyle</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Shops: <strong>{p.shopping_behavior.shopping_frequency}</strong>.</li>
                <li>Prefers <strong>{p.shopping_behavior.preferred_shopping_times.join(" and ")}</strong>.</li>
                <li>Favorite shopping days: <strong>{p.shopping_behavior.favorite_shopping_days.join(" and ")}</strong>.</li>
                <li>Purchases <strong>{p.shopping_behavior.common_purchases.join(" and ")}</strong>.</li>
                {/*<li>Drinks <strong>soda regularly</strong>, possibly as a habit or energy boost.</li>*/}
                {/*<li>Buys <strong>paper towels in bulk</strong>, indicating a well-organized household.</li>*/}
                {/*<li>Includes some fresh fruit, suggesting an occasional preference for fresh produce.</li>*/}
            </ul>
        </div>

          {/*Dietary Habits & Motivations*/}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Dietary Habits & Motivations</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2">
                <li>Focuses on: <strong>{p.dietary_habits.diet_focus}</strong>.</li>
                <li>Cooking preference: <strong>{p.dietary_habits.cooking_preference}</strong>.</li>
                <li>Diet: <strong>{p.dietary_habits.dietary_considerations.join(", ")}</strong>.
                </li>
                <li><strong>Balanced indulgence</strong> - {p.dietary_habits.balanced_indulgence.join(", ")}.
                </li>
                {/*<li><strong>Lactose-conscious choices</strong> - Buys almond milk and Greek yogurt.</li>*/}
                {/*<li><strong>Balanced indulgence</strong> - Enjoys snacks but also buys soda and Cinnamon Toast Crunch.</li>*/}
            </ul>
        </div>

          {/*Shopping Motivation*/}
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Shopping Motivations</h2>
            <ul className="list-disc list-inside text-gray-600 mt-2">
              {p.shopping_motivations.primary_motivations.map((item, index) => {
                const splits = item.split(" - ")
                return (
                <li key={index}>
                  <strong>{splits[0]}</strong> - {splits[1]}.
                </li>
              )})}
              {/*<li><strong>Convenience & Habit</strong> - {p.shopping_motivations.primary_motivations}.</li>*/}
              {/*  <li><strong>Protein & Energy Needs</strong> - Prioritizes high-protein, easy-to-consume foods.</li>*/}
              {/*  <li><strong>On-the-Go or Remote Work Lifestyle</strong> - Prefers snacks over meal prep.</li>*/}
              {/*  <li><strong>Health-Conscious But Not Strict</strong> - Mixes healthy choices with indulgences.</li>*/}
              {/*  <li><strong>Stocking Essentials</strong> - Buys in bulk to maintain household efficiency.</li>*/}
            </ul>
        </div>
    </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
