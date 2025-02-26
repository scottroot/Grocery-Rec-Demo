import Link from "next/link";


export default function NotFound({ userId, cartLength }: { userId?: number, cartLength: number }) {
  return (
    <div className="flex flex-grow flex-col h-full max-w-4xl mx-auto items-center justify-center">
      <div className="text-center p-8 pb-20 font-sans">
        <p className="text-base font-semibold text-indigo-600">
          404
        </p>
        <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
          {userId === 0
            ? "Logged in as Guest."
            : "User Page Not Found"
          }
        </h1>
        <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
          {userId === 0
            ? "Sorry, no user persona is available for the current user (Guest) because there is no historic order data. Historic data is available for existing users - Feel free to switch users and come back to this page."
            : "Sorry, not all user personas have been generated yet, and we couldn&apos;t find a profile for this user."
          }
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {(userId !== 0 && cartLength > 0) &&
            <Link
              href="/user/orders"
              className="text-lg font-semibold text-indigo-600 hover:text-indigo-500"
            >
              <span className="font-bold">But</span>, you can still view the user&apos;s order history here.
            </Link>
          }
        </div>
      </div>
    </div>
  )
}