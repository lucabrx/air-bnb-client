import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { DeleteListingModal } from "~/pages/listings/delete-listing-modal"
import { GalleryModal } from "~/pages/listings/gallery-modal"

import { categories } from "~/config/categories"
import { API, cn } from "~/lib/utils"
import { useListing } from "~/hooks/query/use-listing"
import { useSession } from "~/hooks/query/use-session"
import { Button } from "~/components/ui/button"
import { Input, inputVariants } from "~/components/ui/input"
import { Skeleton } from "~/components/ui/skeleton"
import { DatePicker } from "~/components/calendar"
import { Icons } from "~/components/icons"
import { Layout } from "~/components/layouts/layout"

const Map = dynamic(() => import("~/components/modals/create-listing-modal/custom-map"), { ssr: false })

type ServerSideProps = {
  query: {
    id: "string"
  }
}

export function getServerSideProps({ query }: ServerSideProps) {
  return {
    props: { query },
  }
}

type UpdatePayload = {
  description: string
  title: string
  price: number
}

export default function ListingPage({ query }: ServerSideProps) {
  const queryClient = useQueryClient()
  const [openUpdateDescription, setOpenUpdateDescription] = useState<boolean>(false)
  const [openUpdateTitle, setOpenUpdateTitle] = useState<boolean>(false)
  const [openUpdatePrice, setOpenUpdatePrice] = useState<boolean>(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [galleryModalOpen, setGalleryModalOpen] = useState<boolean>(false)
  const { listing, isLoading } = useListing(query.id)
  const [currentImage, setCurrentImage] = useState<number>(0)
  const { session } = useSession()

  const [descriptionUpdate, setDescriptionUpdate] = useState<string>("")
  const [titleUpdate, setTitleUpdate] = useState<string>("")
  const [priceUpdate, setPriceUpdate] = useState<number>(0)

  useEffect(() => {
    setDescriptionUpdate(listing?.description ?? "")
    setTitleUpdate(listing?.title ?? "")
    setPriceUpdate(listing?.price ?? 0)
  }, [listing])

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

  const { mutate } = useMutation({
    mutationFn: (payload: UpdatePayload) => API.patch(`/v1/listings/${query.id}`, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["listing", query.id] })
      toast.success("Listing updated successfully")
      setOpenUpdateDescription(false)
      setOpenUpdateTitle(false)
      setOpenUpdatePrice(false)
    },
    onError: () => {
      toast.error("Something went wrong, please try again later")
    },
  })

  function handleUpdate() {
    if (descriptionUpdate.length < 10) {
      toast.error("Description must be at least 10 characters long")
      return
    }
    if (titleUpdate.length < 5) {
      toast.error("Title must be at least 5 characters long")
      return
    }
    if (priceUpdate < 1) {
      toast.error("Price must be greater than 1 dollar")
      return
    }
    const payload: UpdatePayload = {
      description: descriptionUpdate,
      title: titleUpdate,
      price: priceUpdate,
    }

    mutate(payload)
  }

  const CategoryIcon = categories.find((category) => category.label === listing?.category)
  const mapCenter: number[] = [Number(listing?.location.lat), Number(listing?.location.lng)]
  return (
    <>
      <Layout title={listing ? listing.title : ""} className="flex max-w-[70rem] flex-col gap-4 pb-8 md:px-8">
        {isLoading ? (
          <>
            <section className="text-start">
              <Skeleton className="h-10 w-1/2" />
              <Skeleton className="mt-2 h-6 w-3/5" />
              <Skeleton className="mt-6 aspect-video w-full" />
            </section>

            <section className="flex flex-col md:flex-row-reverse md:gap-8">
              <Skeleton className="mt-2 aspect-square max-h-[40rem] w-full" />
              <div className="w-full">
                <article className="flex w-full flex-col justify-start gap-2 border-b border-border py-4">
                  <div className="flex w-full items-center justify-start gap-2">
                    <Skeleton className="h-6 w-3/5" />
                    <Skeleton className="aspect-square h-10 rounded-full" />
                  </div>
                  <div className="flex w-full items-center justify-start gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </article>
                <article className="flex w-full items-start justify-start gap-2 border-b border-border py-4">
                  <div className="flex  items-center justify-start gap-2">
                    <Skeleton className="aspect-square h-12 rounded-full" />
                  </div>
                  <div className="flex  flex-col items-start justify-start gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                </article>
                <article className="flex w-full flex-col items-start justify-start gap-2 border-b border-border py-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-square h-4 w-full rounded-full" />
                  ))}
                </article>

                <Skeleton className="mt-2 aspect-square w-full" />
              </div>
            </section>
          </>
        ) : (
          <>
            <section className=" text-start">
              <div className="flex w-full items-center justify-between">
                <article>
                  {openUpdateTitle ? (
                    <Input
                      className="text-2xl font-bold"
                      variant="empty"
                      value={titleUpdate}
                      onChange={(e) => setTitleUpdate(e.target.value)}
                    />
                  ) : (
                    <h2 className="text-2xl font-bold">{listing?.title}</h2>
                  )}
                  <p className="text-muted-foreground">
                    {listing?.location.region}, {listing?.location.label}
                  </p>
                </article>
                {session?.id === listing?.ownerId && (
                  <article className="flex items-center justify-center gap-2">
                    <Button
                      onClick={() => setOpenUpdateTitle(!openUpdateTitle)}
                      variant="ghost"
                      className="h-7 w-7 p-0"
                    >
                      <Icons.Pen className="h-4 w-4" />
                    </Button>

                    {openUpdateTitle && listing?.title !== titleUpdate && (
                      <Button onClick={handleUpdate} className="h-7 w-7 p-0">
                        <Icons.Check className="h-4 w-4" />
                      </Button>
                    )}

                    <Button size="sm" variant="destructive" onClick={() => setDeleteModalOpen(true)}>
                      Delete Property
                    </Button>
                  </article>
                )}
              </div>

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
            </section>

            <section className="mt-4 grid flex-col md:grid-cols-2 md:gap-8 lg:grid-cols-[60%,1fr]">
              <Calendar
                handleUpdate={handleUpdate}
                price={priceUpdate}
                setUpdatePrice={setPriceUpdate}
                openUpdatePrice={openUpdatePrice}
                setOpenUpdatePrice={setOpenUpdatePrice}
                ownerId={listing?.ownerId}
              />
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
                <article className="flex w-full items-center justify-start gap-2 border-b border-border py-4">
                  {CategoryIcon && <CategoryIcon.icon className="h-12 w-12" />}
                  <div className="flex  flex-col items-start justify-start">
                    <h2 className="text-xl font-medium">{CategoryIcon?.label}</h2>
                    <p className="text-muted-foreground">{CategoryIcon?.description}</p>
                  </div>
                </article>
                <article className="relative flex w-full flex-col items-start justify-start gap-2 border-b border-border py-4">
                  <h2 className="text-xl font-medium">Description</h2>
                  {openUpdateDescription ? (
                    <textarea
                      onChange={(e) => setDescriptionUpdate(e.target.value)}
                      className={inputVariants({
                        variant: "empty",
                      })}
                      value={descriptionUpdate}
                    />
                  ) : (
                    <p className="text-muted-foreground">{listing?.description}</p>
                  )}
                  {session?.id === listing?.ownerId && (
                    <>
                      <Button
                        onClick={() => setOpenUpdateDescription(!openUpdateDescription)}
                        className="absolute right-4 top-4 h-7 w-7 p-0"
                        variant="ghost"
                      >
                        <Icons.Pen className="h-4 w-4" />
                      </Button>
                      {openUpdateDescription && listing?.description !== descriptionUpdate && (
                        <Button onClick={handleUpdate} className="absolute right-4 top-12 h-7 w-7 p-0">
                          <Icons.Check className="h-4 w-4" />
                        </Button>
                      )}
                    </>
                  )}
                </article>

                <article className="flex w-full flex-col items-start justify-start gap-2 border-b border-border py-4">
                  <h2 className="text-xl font-medium">Location</h2>
                  <div className="aspect-square w-full">
                    <Map center={mapCenter} />
                  </div>
                </article>
              </div>
            </section>
          </>
        )}
      </Layout>

      <DeleteListingModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} listingId={query.id} />
      <GalleryModal
        isOpen={galleryModalOpen}
        onClose={() => setGalleryModalOpen(false)}
        images={listing?.images}
        listingId={query.id}
      />
    </>
  )
}

type CalendarProps = {
  price: number
  setUpdatePrice: (price: number) => void
  ownerId?: number
  openUpdatePrice: boolean
  setOpenUpdatePrice: (open: boolean) => void
  handleUpdate: () => void
}
function Calendar({
  price,
  setOpenUpdatePrice,
  ownerId,
  openUpdatePrice,
  setUpdatePrice,
  handleUpdate,
}: CalendarProps) {
  const { session } = useSession()
  return (
    <article className="h-fit w-full overflow-hidden rounded-xl border border-border bg-card md:order-2">
      <div className="relative flex flex-row items-center gap-1 p-4">
        {ownerId === session?.id && (
          <div className="absolute right-3 top-3 flex items-center justify-center gap-2">
            <Button onClick={() => setOpenUpdatePrice(!openUpdatePrice)} variant="ghost" className="h-7 w-7 p-0">
              <Icons.Pen className="h-4 w-4" />
            </Button>
            {openUpdatePrice && (
              <Button onClick={handleUpdate} className="h-7 w-7 p-0">
                <Icons.Check className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
        {openUpdatePrice ? (
          <Input
            className="w-5/6 text-2xl font-bold"
            variant="empty"
            type="number"
            value={price}
            onChange={(e) => setUpdatePrice(Number(e.target.value))}
          />
        ) : (
          <h2 className="text-2xl font-bold">
            $ {price} <span className="text-sm font-normal">night</span>
          </h2>
        )}
      </div>
      <hr />
      <DatePicker value={{ startDate: new Date(), endDate: new Date() }} onChange={() => {}} disabledDates={[]} />
      <hr />
      <div className="p-4">
        <Button size="lg" className="w-full">
          Book
        </Button>
      </div>
      <hr />
      <div className="flex flex-row items-center justify-between p-4 text-lg font-semibold">
        <h2>Total</h2>
        <h2>$ 100</h2>
      </div>
    </article>
  )
}
