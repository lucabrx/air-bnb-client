import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { type ListingImage } from "~/hooks/query/use-user-listings"
import { Button } from "~/components/ui/button"
import { Icons } from "~/components/icons"

type ListingCardProps = {
  href: string
  images: ListingImage[]
  region?: string
  label?: string
  price?: number
  reservation?: boolean
}

export function ListingCard({ href, images, region, label, price, reservation }: ListingCardProps) {
  const [currentImage, setCurrentImage] = useState<number>(0)

  function handleImageRightClick() {
    if (images) {
      if (currentImage === images.length - 1) {
        setCurrentImage(0)
      } else {
        setCurrentImage(currentImage + 1)
      }
    }
  }

  function handleImageLeftClick() {
    if (images) {
      if (currentImage === 0) {
        setCurrentImage(images.length - 1)
      } else {
        setCurrentImage(currentImage - 1)
      }
    }
  }

  return (
    <article className="col-span-1 ">
      <div className="relative flex  w-full flex-col gap-2 overflow-hidden rounded-md">
        {images?.length > 1 && (
          <Button
            className="absolute right-2 top-1/2 z-10 h-6 w-6 -translate-y-1/2 rounded-full p-0"
            onClick={handleImageRightClick}
          >
            <Icons.ChevronRight className="h-4 w-4" />
          </Button>
        )}
        <Link href={href} className="group  cursor-pointer">
          <Image
            src={images ? images[currentImage].url : "/default-placeholder.png"}
            alt="property image"
            width={1000}
            height={1000}
            className="aspect-square rounded-md object-cover transition-all duration-300 ease-in-out hover:opacity-80 group-hover:scale-110"
          />
        </Link>
        {images?.length > 1 && (
          <Button
            className="absolute left-2 top-1/2 z-10 h-6 w-6 -translate-y-1/2 rounded-full p-0"
            onClick={handleImageLeftClick}
          >
            <Icons.ChevronLeft className="h-4 w-4" />
          </Button>
        )}
      </div>
      {region && label && (
        <h2 className="text-lg font-semibold">
          {region}, {label}
        </h2>
      )}
      {price && (
        <div className="flex flex-row items-center gap-1">
          <span className="font-semibold">${price}</span>
          {!reservation && <span className="font-light">night</span>}
        </div>
      )}
    </article>
  )
}
