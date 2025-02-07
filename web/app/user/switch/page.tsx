import Image from "next/image";
import {graphRead} from "@/lib/neo4j/neo4js";
import {SearchParams} from "@/types";
import SwitchButton from "@/app/user/switch/SwitchButton";

export default async function Page({ searchParams, }: { searchParams: SearchParams }) {

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/*<img*/}
        {/*  alt="Your Company"*/}
        {/*  src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"*/}
        {/*  className="mx-auto h-10 w-auto"*/}
        {/*/>*/}
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
          Switch users
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="space-y-6">
          <SwitchButton title="Existing" subtitle="" targetId={1} />
          <SwitchButton title="Guest" subtitle="Temporary user" targetId={0} />
          <SwitchButton title="Random" subtitle="Switch to another user from the dataset" targetId={-1} />
          {/*<div*/}
          {/*  key={"person.email"}*/}
          {/*  className="relative flex items-center pl-8 space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"*/}
          {/*>*/}
          {/*  <div className="relative shrink-0">*/}
          {/*    <div className="absolute left-0 w-8 -translate-x-full flex h-full items-center">*/}
          {/*      <Image alt="" src="/checkmark.png" width={32} height={32} />*/}
          {/*    </div>*/}
          {/*    <Image alt="" src="/user.jpg" width={40} height={40} className="size-10 rounded-full" />*/}
          {/*  </div>*/}
          {/*  <div className="min-w-0 flex-1">*/}
          {/*    <a href="#" className="focus:outline-none">*/}
          {/*      <span aria-hidden="true" className="absolute inset-0" />*/}
          {/*      <p className="text-sm font-medium text-gray-900">Guest</p>*/}
          {/*      <p className="truncate text-sm text-gray-500">Temporary user</p>*/}
          {/*    </a>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div*/}
          {/*  key={"existing-user"}*/}
          {/*  className="relative flex items-center pl-8 space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"*/}
          {/*>*/}
          {/*  <div className="relative shrink-0">*/}
          {/*    /!*<div className="absolute left-0 w-8 -translate-x-full flex h-full items-center">*!/*/}
          {/*    /!*  <Image alt="" src="/checkmark.png" width={32} height={32} />*!/*/}
          {/*    /!*</div>*!/*/}
          {/*    <Image alt="" src="/user.jpg" width={40} height={40} className="size-10 rounded-full" />*/}
          {/*  </div>*/}
          {/*  <div className="min-w-0 flex-1">*/}
          {/*    <a href="#" className="focus:outline-none">*/}
          {/*      <span aria-hidden="true" className="absolute inset-0" />*/}
          {/*      <p className="text-sm font-medium text-gray-900">Random</p>*/}
          {/*      <p className="truncate text-sm text-gray-500">Existing user from dataset</p>*/}
          {/*    </a>*/}
          {/*  </div>*/}
          {/*</div>*/}
          {/*<div>*/}
          {/*  <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">*/}
          {/*    Email address*/}
          {/*  </label>*/}
          {/*  <div className="mt-2">*/}
          {/*    <input*/}
          {/*      id="email"*/}
          {/*      name="email"*/}
          {/*      type="email"*/}
          {/*      required*/}
          {/*      autoComplete="email"*/}
          {/*      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div>*/}
          {/*  <div className="flex items-center justify-between">*/}
          {/*    <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">*/}
          {/*      Password*/}
          {/*    </label>*/}
          {/*    <div className="text-sm">*/}
          {/*      <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">*/}
          {/*        Forgot password?*/}
          {/*      </a>*/}
          {/*    </div>*/}
          {/*  </div>*/}
          {/*  <div className="mt-2">*/}
          {/*    <input*/}
          {/*      id="password"*/}
          {/*      name="password"*/}
          {/*      type="password"*/}
          {/*      required*/}
          {/*      autoComplete="current-password"*/}
          {/*      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/*<div>*/}
          {/*  <button*/}
          {/*    type="submit"*/}
          {/*    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"*/}
          {/*  >*/}
          {/*    Sign in*/}
          {/*  </button>*/}
          {/*</div>*/}
        </div>

        {/*<p className="mt-10 text-center text-sm/6 text-gray-500">*/}
        {/*  Not a member?{' '}*/}
        {/*  <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">*/}
        {/*    Start a 14 day free trial*/}
        {/*  </a>*/}
        {/*</p>*/}
      </div>
    </div>
  )
}
