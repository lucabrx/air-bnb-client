import type { ListingImage } from "~/hooks/query/use-listing"
import { usePropertyBookings } from "~/hooks/query/use-property-bookings"
import { Button } from "~/components/ui/button"
import { ListingCard } from "~/components/ui/listing-card"
import { Modal } from "~/components/ui/modal"

type PropertyBookingsModal = {
  isOpen: boolean
  onClose: () => void
  listingId: string
}

export function PropertyBookingsModal({ isOpen, onClose, listingId }: PropertyBookingsModal) {
  const { bookings } = usePropertyBookings(listingId)
  console.log(bookings)
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Bookings" styles="lg:w-[48rem]">
      <section className="mt-4 flex flex-wrap gap-8 p-4">
        {bookings?.map((booking) => {
          return (
            <div key={booking.id} className="grid max-w-[10rem] gap-1">
              <ListingCard href={`/listings/${booking.listing.id}`} images={booking.listing.images} />
              <p className="text-foreground/80">From: {new Date(booking.checkIn).toLocaleDateString()}</p>
              <p className="text-foreground/80">To: {new Date(booking.checkOut).toLocaleDateString()}</p>
              <p className="text-foreground/80">
                Total: <span className="font-bold">{booking.total} $</span>
              </p>
            </div>
          )
        })}
      </section>
    </Modal>
  )
}
