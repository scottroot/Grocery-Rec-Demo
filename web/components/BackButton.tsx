import Link from "next/link";
import {ArrowUturnLeftIcon} from "@heroicons/react/20/solid";


export default function BackButton({ returnUrl }: { returnUrl?: string }) {
  if (returnUrl) {
    return (
      <Link href={returnUrl} className="group flex items-center">
        <ArrowUturnLeftIcon className="inline-flex w-3 h-4 mr-2" />
        back to previous page
      </Link>
    )
  }

  return null;
}