"use client"

import Image from "next/image";
import {useCart} from "@/lib/useCart";


export default function SwitchButton({title, subtitle, targetId}: {title: string; subtitle: string, targetId: number}) {
  const { userId, switchUser } = useCart();

  const isActive = Boolean(
    (targetId === 0 && userId === 0)
    || (targetId === 1 && Number(userId || 0) > 0)
  )

  if(typeof userId === 'number' && userId < 1 && targetId === 1) return <></>;

  return (
    <button className="w-full" onClick={() => switchUser(targetId)}>
    <div
      key={title}
      className="relative flex items-center pl-8 space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
    >
      <div className="relative shrink-0">
        {isActive &&
          <div className="absolute left-0 w-8 -translate-x-full flex h-full items-center">
            <Image alt="" src="/checkmark.png" width={32} height={32} />
          </div>
        }
        {title === "Random"
          ? <Image alt="" src="/shuffle.png" width={40} height={40} className="size-10 rounded-full" />
          : <Image alt="" src="/user.jpg" width={40} height={40} className="size-10 rounded-full" />
        }
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="focus:outline-none">
          <span aria-hidden="true" className="absolute inset-0" />
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="truncate text-sm text-gray-500">{userId > 0 && targetId === 1 ? userId : subtitle}</p>
        </div>
      </div>
    </div>
    </button>
  )
}