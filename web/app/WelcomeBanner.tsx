"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { useHookstate } from "@hookstate/core";
import { localstored } from "@hookstate/localstored";
import { XMarkIcon } from "@heroicons/react/20/solid";


export default function HomepageInfo() {
  const state = useHookstate(
    { welcome: 1 },
    localstored({ key: "user-options-key" })
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, [])

  if(!mounted || !state.welcome.value) return null;

  return (
    <div className="relative bg-indigo-50/50 rounded">
      <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
        <button
          type="button"
          onClick={() => state.welcome.set(0)}
          className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          <span className="sr-only">Close</span>
          <XMarkIcon aria-hidden="true" className="size-6" />
        </button>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-16 lg:px-8 space-y-8">
        <p className="flex items-center gap-2 text-lg">
          <span className="bg-red-500 rounded-sm text-white px-3 py-1 font-semibold leading-tight">
            First time?
          </span>
          <span className="">
            Visit the <Link href="/info" className="font-semibold hover:underline">Demo Info page</Link> for a quick guide.
          </span>
        </p>
        <h2 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Explore personalized grocery recommendations.
        </h2>
        <div className="xmt-10 flex items-center gap-x-6">
          <Link
            href="#browse-departments"
            className="group rounded-md bg-gray-200 hover:bg-gray-300 transition-opacity px-3.5 py-2.5 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900">
              Get started
            </span>
          </Link>
          <Link href="/info" className="text-sm/6 font-semibold text-gray-700 hover:text-gray-900">
            Learn more <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
