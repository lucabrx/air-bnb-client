import { useEffect, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { addDays } from "date-fns"
import { toast } from "sonner"

import { DateRangePicker } from "~/pages/listings/date-range-picker"
import { DeleteListingModal } from "~/pages/listings/delete-listing-modal"
import { GalleryModal } from "~/pages/listings/gallery-modal"
import { HeroImages } from "~/pages/listings/hero-images"
import { LeftSideInfo } from "~/pages/listings/left-side-info"
import { PageLoadingSkeleton } from "~/pages/listings/page-loading-skeleton"
import { PriceSection } from "~/pages/listings/price-section"
import { PropertyBookingsModal } from "~/pages/listings/property-bookings-modal"

import { categories } from "~/config/categories"
import { API } from "~/lib/utils"
import { useListing } from "~/hooks/query/use-listing"
import { usePropertyBookings } from "~/hooks/query/use-property-bookings"
import { useSession } from "~/hooks/query/use-session"
import { Button } from "~/components/ui/button"
import { Input, inputVariants } from "~/components/ui/input"
import { Icons } from "~/components/icons"
import { Layout } from "~/components/layouts/layout"

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

type BookingPayload = {
  listingId: number
  startDate: Date
  endDate: Date
  pricing: number
}

export default function ListingPage({ query }: ServerSideProps) {
  const [startDate, setStartDate] = useState<Date | null>(new Date())
  const [endDate, setEndDate] = useState<Date | null>(addDays(new Date(), 1))

  const from = addDays(new Date(), -1)
  const firstDayInHistory = new Date(1970, 1, 1)

  const queryClient = useQueryClient()
  const [openUpdateDescription, setOpenUpdateDescription] = useState<boolean>(false)
  const [openUpdateTitle, setOpenUpdateTitle] = useState<boolean>(false)
  const [openUpdatePrice, setOpenUpdatePrice] = useState<boolean>(false)

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [galleryModalOpen, setGalleryModalOpen] = useState<boolean>(false)
  const [propertyBookingsModalOpen, setPropertyBookingsModalOpen] = useState<boolean>(false)
  const { listing, isLoading } = useListing(query.id)
  const { session } = useSession()

  const [descriptionUpdate, setDescriptionUpdate] = useState<string>("")
  const [titleUpdate, setTitleUpdate] = useState<string>("")
  const [priceUpdate, setPriceUpdate] = useState<number>(0)

  useEffect(() => {
    setDescriptionUpdate(listing?.description ?? "")
    setTitleUpdate(listing?.title ?? "")
    setPriceUpdate(listing?.price ?? 0)
  }, [listing])

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

  const { mutate: mutateBooking } = useMutation({
    mutationFn: (payload: BookingPayload) => API.post("/v1/bookings", payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["listing", query.id] })
      toast.success("Booking created successfully")
    },
    onError: () => {
      toast.error("Something went wrong, please try again later")
    },
  })

  function handleBooking() {
    const payload: BookingPayload = {
      listingId: Number(query.id),
      startDate: startDate ?? new Date(),
      endDate: endDate ?? addDays(new Date(), 1),
      pricing: listing?.price ?? 0,
    }

    mutateBooking(payload)
  }

  const { bookings } = usePropertyBookings(query.id)
  const disabledDays = [{ from: firstDayInHistory, to: from }]
  bookings?.forEach((booking) => {
    disabledDays.push({ from: new Date(booking.checkIn), to: new Date(booking.checkOut) })
  })

  console.log("disabledDays", disabledDays)
  const CategoryIcon = categories.find((category) => category.label === listing?.category)
  return (
    <>
      <Layout title={listing ? listing.title : ""} className="flex max-w-[70rem] flex-col gap-4 pb-8 md:px-8">
        {isLoading ? (
          <PageLoadingSkeleton />
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

                    <Button onClick={() => setPropertyBookingsModalOpen(true)} size="sm">
                      <Icons.ChevronLeft className="h-4 w-4" /> See Bookings
                    </Button>

                    <Button size="sm" variant="destructive" onClick={() => setDeleteModalOpen(true)}>
                      Delete Property
                    </Button>
                  </article>
                )}
              </div>
              <HeroImages listing={listing} setGalleryModalOpen={setGalleryModalOpen} session={session} />
            </section>
            <section className="mt-4 grid flex-col md:grid-cols-2 md:gap-8 lg:grid-cols-[60%,1fr]">
              <div className="order-1">
                <article className="flex w-full items-center justify-start gap-2 py-4">
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
                <PriceSection
                  session={session}
                  listing={listing}
                  setOpenUpdatePrice={setOpenUpdatePrice}
                  openUpdatePrice={openUpdatePrice}
                  endDate={endDate}
                  startDate={startDate}
                  priceUpdate={priceUpdate}
                  setPriceUpdate={setPriceUpdate}
                  handleUpdate={handleUpdate}
                />
                <div className="flex w-full items-center justify-center py-2">
                  <DateRangePicker
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    disabledDates={disabledDays}
                  />
                </div>

                <Button
                  disabled={session?.id === listing?.ownerId || !startDate || !endDate}
                  onClick={handleBooking}
                  className="mt-2 w-full disabled:cursor-not-allowed"
                >
                  Book
                </Button>
              </div>
              <LeftSideInfo listing={listing} />
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
      <PropertyBookingsModal
        isOpen={propertyBookingsModalOpen}
        onClose={() => setPropertyBookingsModalOpen(false)}
        listingId={query.id}
      />
    </>
  )
}
