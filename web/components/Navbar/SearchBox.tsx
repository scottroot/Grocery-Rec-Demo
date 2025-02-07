"use client"
import {MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import {useEffect, useState} from "react";

export default function SearchBox() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const [query, setQuery] = useState(searchParams.get('query')?.toString() || "");

  useEffect(() => {
    setQuery(searchParams.get('query')?.toString() || "")
  }, [searchParams, pathname])
  function handleSearch(term: string) {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('query', term);
    } else {
      params.delete('query');
    }
    push(`/search/?${params.toString()}`);

  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function handleEnter(event: any) {
    if (event?.key === "Enter") {
      handleSearch(query);
    }
  }

  return (
    <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
      <input
        name="search"
        type="search"
        autoCorrect="off"
        autoComplete="off"
        placeholder="Search"
        className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pl-10 pr-3 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-red-500 sm:text-sm/6"
        onChange={(e) => {
          // handleSearch(e.target.value);
          setQuery(e.target.value);
        }}
        defaultValue={query}
        onKeyDown={(e) => handleEnter(e)}
        //
      />
      <MagnifyingGlassIcon
        aria-hidden="true"
        className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
      />
    </div>
  )
}