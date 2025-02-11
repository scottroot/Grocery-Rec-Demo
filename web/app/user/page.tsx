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
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_ACCESS_KEY_SECRET!,
  },
});


async function getUserPersona(userId: number) {
  try {
    const response = await s3Client.send(
      new GetObjectCommand({
        Bucket: S3_BUCKET_NAME,
        Key: `${userId}.json`,
      }),
    );
    if(!response) return;
    const str = await response.Body?.transformToString();
    return JSON.parse(str!).user_persona;
  }
  catch(err) {
    console.log(err)
  }
}



function NotFound() {
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
      </div>
    </div>
  )
}

export default async function Page() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  const userId = session.userId;
  if(typeof userId !== 'number') return <NotFound />;

  const p = await getUserPersona(userId);
  if (!p) return <NotFound />;

  return (
    <div
      className="items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]"
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
            </ul>
        </div>
    </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">

      </footer>
    </div>
  );
}
