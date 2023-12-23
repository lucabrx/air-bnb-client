import Image from "next/image"
import Link from "next/link"

import { type ListingImage } from "~/hooks/query/use-user-listings"

type ListingCardProps = {
  href: string
  images: ListingImage[]
  region: string
  label: string
  price: number
  reservation?: boolean
}
export function ListingCard({ href, images, region, label, price, reservation }: ListingCardProps) {
  return (
    <Link href={href} className="group col-span-1 cursor-pointer">
      <div className="flex w-full flex-col gap-2">
        <Image src={images[0].url} alt="property image" width={1000} height={1000} className="rounded-md" />
      </div>
      <h2 className="text-lg font-semibold">
        {region}, {label}
      </h2>
      <div className="flex flex-row items-center gap-1">
        <span className="font-semibold">${price}</span>
        {!reservation && <span className="font-light">night</span>}
      </div>
    </Link>
  )
}
