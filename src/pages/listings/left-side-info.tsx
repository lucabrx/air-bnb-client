import dynamic from "next/dynamic"
import Image from "next/image"

import { type Listing } from "~/hooks/query/use-listing"

const Map = dynamic(() => import("~/components/modals/create-listing-modal/custom-map"), { ssr: false })

type LeftSideInfoProps = {
  listing?: Listing
}
export function LeftSideInfo({ listing }: LeftSideInfoProps) {
  const mapCenter: number[] = [Number(listing?.location.lat), Number(listing?.location.lng)]

  return (
    <div className="flex w-full flex-col justify-start">
      <article className="flex w-full flex-col items-start justify-start gap-2 border-b border-border pb-4">
        <div className="flex w-full items-center justify-start gap-4">
          <h2 className="text-xl font-medium">Hosted by {listing?.ownerName}</h2>
          <Image
            className="aspect-square h-10 w-10 rounded-full object-cover"
            src={listing?.ownerPhoto ?? "/default-user.png"}
            alt="Image of owner"
            width={48}
            height={48}
          />
        </div>
        <div className="flex w-full items-center justify-start gap-2">
          <p className="text-muted-foreground">{listing?.guests} guests</p>
          <p className="text-muted-foreground">{listing?.bedrooms} bedrooms</p>
          <p className="text-muted-foreground">{listing?.bathrooms} bathrooms</p>
        </div>
      </article>

      <article className="flex w-full flex-col items-start justify-start gap-2 py-4">
        <h2 className="text-xl font-medium">Location</h2>
        <div className="aspect-square w-full">
          <Map center={mapCenter} />
        </div>
      </article>
    </div>
  )
}
