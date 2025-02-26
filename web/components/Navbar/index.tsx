"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Disclosure } from '@headlessui/react'
import clsx from "clsx";
import SearchBox from "./SearchBox";
import NavCartComponent from "./NavCartComponent";
import NavProfileComponent from "./NavProfileComponent";
import Logo from "@/components/Navbar/Logo";


const MENU_ITEMS = [
  {href: "/", label: "Go Shopping"},
  {href: "/info", label: "Demo Info"},
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <Disclosure as="nav" className="bg-white shadow fixed w-full top-0 left-0 right-0 z-[1000]">
      <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex px-2 lg:px-0">
            <Link href="/" className="flex shrink-0 items-center">
              <Logo />
            </Link>
            <div className="ml-6 flex space-x-8">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${clsx(
                    "inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium", 
                    item.href == pathname ? "border-red-500 text-gray-900" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  )}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex flex-1 items-center justify-center px-2 md:ml-6 md:justify-end">
            <SearchBox />
          </div>

          <div className="hidden sm:ml-4 sm:flex sm:items-center">
            <NavCartComponent />
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <NavProfileComponent />
          </div>

        </div>
      </div>
    </Disclosure>
  )
}
