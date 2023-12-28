import { useState } from "react"
import Image from "next/image"

import { cn } from "~/lib/utils"
import { type Listing } from "~/hooks/query/use-listing"
import { type User } from "~/hooks/query/use-session"
import { Button } from "~/components/ui/button"
import { Icons } from "~/components/icons"

type HeroImagesProps = {
  listing?: Listing
  setGalleryModalOpen: (open: boolean) => void
  session?: User
}
export function HeroImages({ listing, setGalleryModalOpen, session }: HeroImagesProps) {
  const [currentImage, setCurrentImage] = useState<number>(0)

  function handleImageLeftClick() {
    if (listing?.images) {
      if (currentImage === 0) {
        setCurrentImage(listing.images.length - 1)
      } else {
        setCurrentImage(currentImage - 1)
      }
    }
  }

  function handleImageRightClick() {
    if (listing?.images) {
      if (currentImage === listing.images.length - 1) {
        setCurrentImage(0)
      } else {
        setCurrentImage(currentImage + 1)
      }
    }
  }

  function handleDotClick(i: number) {
    setCurrentImage(i)
  }
  return (
    <article className="relative mt-4 aspect-video w-full">
      <Image
        className="h-full w-full rounded-md object-cover"
        src={listing?.images?.[currentImage]?.url ?? "/default-placeholder.png"}
        alt="Image of property"
        width={1000}
        height={1000}
      />

      {session?.id === listing?.ownerId && (
        <Button
          onClick={() => setGalleryModalOpen(true)}
          variant="outline"
          size="icon"
          className="absolute right-4 top-4"
        >
          <Icons.Image className="h-5 w-5" />
        </Button>
      )}

      <div className="absolute inset-x-0 bottom-3 flex h-fit w-full items-center justify-center gap-1.5 ">
        {listing &&
          listing?.images?.length > 1 &&
          listing?.images.map((_, i) => (
            <span
              key={i}
              onClick={() => handleDotClick(i)}
              className={cn(
                "h-2.5 w-2.5 cursor-pointer rounded-full bg-muted-foreground/90 transition-colors hover:bg-primary/80",
                i === currentImage && "bg-white/90"
              )}
            />
          ))}
      </div>

      {listing && listing?.images?.length > 1 && (
        <>
          <Button
            size="icon"
            className="absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
            onClick={handleImageLeftClick}
          >
            <Icons.ChevronLeft className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full"
            onClick={handleImageRightClick}
          >
            <Icons.ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </article>
  )
}
