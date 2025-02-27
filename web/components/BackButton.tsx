import type { ReactNode } from "react";
import Link from "next/link";
import {ArrowUturnLeftIcon} from "@heroicons/react/20/solid";


export default function BackButton({ returnUrl, text }: { returnUrl?: string, text?: string|ReactNode }) {
  if (returnUrl) {
    return (
      <Link href={returnUrl} className="group flex items-center">
        <ArrowUturnLeftIcon className="inline-flex w-3 h-4 mr-2" />
        {text ? text : "back to previous page"}
      </Link>
    )
  }

  return null;
}