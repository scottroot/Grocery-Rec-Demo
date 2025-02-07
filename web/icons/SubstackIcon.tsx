import Image from "next/image";
import clsx from "clsx";


export default function Icon(props: any) {
  return (
    <div {...props} style={{position: "relative", background: "black", borderRadius: "100%"}}>
      <Image src="/substack_logo.png" alt="Substack Logo" fill className="object-contain brightness-200 saturation-0 " />
    </div>
  )
}
