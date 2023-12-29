import { useRouter } from "next/router"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { API } from "~/lib/utils"
import { useUserBookings } from "~/hooks/query/use-user-bookings"
import { Button } from "~/components/ui/button"
import { ListingCard } from "~/components/ui/listing-card"
import { Skeleton } from "~/components/ui/skeleton"
import { Layout } from "~/components/layouts/layout"

export default function PropertiesPage() {
  const router = useRouter()
  const { bookings, isLoading } = useUserBookings()

  const { mutate, isPending } = useMutation({
    mutationFn: ({ id }: { id: number }) => API.delete(`/v1/bookings/${id}`),
    onSuccess: () => {
      toast.info("Booking has been canceled.")
      void router.reload()
    },
    onError: () => {
      toast.error("Something went wrong, please try again later.")
    },
  })
  return (
    <Layout title="Properties">
      <section className="flex flex-1 flex-col items-center justify-center">
        <h1 className="w-full text-left text-2xl font-bold">Bookings</h1>
        <p className="w-full text-muted-foreground">List of your bookings</p>
      </section>
      {isLoading ? (
        <section className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square h-full w-full rounded-md" />
          ))}
        </section>
      ) : !bookings ? (
        <div className="mt-4 flex w-full flex-col items-center justify-center">
          <p className="text-muted-foreground">You don&apos;t have any properties.</p>
        </div>
      ) : (
        <section className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
          {bookings?.map((booking) => {
            const bookingStarted = new Date(booking.checkIn).getTime() < new Date().getTime()
            const fromStarted = new Date(booking.checkIn).getTime() < new Date().getTime()
            const toEnded = new Date(booking.checkOut).getTime() < new Date().getTime()
            return (
              <div key={booking.id} className="grid gap-1">
                <ListingCard
                  href={`/listings/${booking.listing.id}`}
                  images={booking.listing.images}
                  region={booking.listing.location.region}
                  label={booking.listing.title}
                  price={booking.listing.price}
                />
                <p className="text-foreground/80">
                  From: {new Date(booking.checkIn).toLocaleDateString()}
                  {fromStarted && <span className="text-red-500"> (Started)</span>}
                </p>
                <p className="text-foreground/80">
                  To: {new Date(booking.checkOut).toLocaleDateString()}
                  {toEnded && <span className="text-red-500"> (Ended)</span>}
                </p>
                <p className="text-foreground/80">
                  Total: <span className="font-bold">{booking.total} $</span>
                </p>
                <Button
                  onClick={() => mutate({ id: booking.id })}
                  isLoading={isPending}
                  disabled={isLoading || bookingStarted}
                  className="mt-2"
                  size="sm"
                >
                  Cancel
                </Button>
              </div>
            )
          })}
        </section>
      )}
    </Layout>
  )
}
