import Image from "next/image";
import Link from "next/link";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {useCart} from "@/lib/useCart";


export default function NavProfileComponent() {
  const { userId } = useCart();
  return (
    <Menu as="div" className="relative ml-3">
      <div>
        <MenuButton className="relative flex rounded-full bg-white text-sm focus:outline-none xfocus:ring-2 xfocus:ring-indigo-500 xfocus:ring-offset-2">
          <span className="absolute -inset-1.5" />
          <span className="sr-only">Open user menu</span>
          <div className="relative size-8">
            <Image
              fill
              sizes="32px"
              alt=""
              src="/avatars/0.jpg"
              className="rounded-full"
            />
          </div>
        </MenuButton>
      </div>
      <MenuItems
        modal={false}
        transition
        className="absolute right-0 z-100 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-200 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
      >
        <MenuItem>
          <div className="no-select block px-4 py-2 data-[focus]:bg-gray-50 data-[focus]:outline-none border-b border-gray-100">
            <p className="text-xs font-medium text-gray-600">
              Hello {userId === 0 ? "Guest" : "Existing User"}
            </p>
            <p className="text-xs leading-none text-gray-400 italic">{userId}</p>
          </div>
        </MenuItem>
        <MenuItem>
          <Link
            href="/user"
            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
          >
            View User Persona
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            href="/user/orders"
            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
          >
            Order History
          </Link>
        </MenuItem>
        <MenuItem>
          <Link
            href="/user/switch"
            className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:outline-none"
          >
            Switch User
          </Link>
        </MenuItem>
      </MenuItems>
    </Menu>
  )
}