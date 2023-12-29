import { differenceInDays, endOfDay } from "date-fns"

import { type Listing } from "~/hooks/query/use-listing"
import { type User } from "~/hooks/query/use-session"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Icons } from "~/components/icons"

type PriceSectionProps = {
  session?: User
  listing?: Listing
  setOpenUpdatePrice: (open: boolean) => void
  openUpdatePrice: boolean
  startDate: Date | null
  endDate: Date | null
  priceUpdate: number
  setPriceUpdate: (price: number) => void
  handleUpdate: () => void
}
export function PriceSection({
  session,
  listing,
  setOpenUpdatePrice,
  openUpdatePrice,
  endDate,
  startDate,
  priceUpdate,
  setPriceUpdate,
  handleUpdate,
}: PriceSectionProps) {
  return (
    <div className="relative mt-2 flex items-center justify-between py-2">
      {openUpdatePrice ? (
        <div className="relative flex w-fit items-center justify-center gap-2">
          <span className="flex w-[4.3rem] font-medium">Price: $</span>
          <Input
            className="-ml-4"
            variant="empty"
            value={priceUpdate}
            onChange={(e) => setPriceUpdate(Number(e.target.value))}
          />
        </div>
      ) : (
        <>
          <div className="relative">
            {session?.id === listing?.ownerId && (
              <div className="absolute -right-8 -top-0.5">
                <Button onClick={() => setOpenUpdatePrice(!openUpdatePrice)} className=" h-7 w-7 p-0" variant="ghost">
                  <Icons.Pen className="h-4 w-4" />
                </Button>
                {openUpdatePrice && listing?.price !== priceUpdate && (
                  <Button onClick={handleUpdate} className="h-7 w-7 p-0">
                    <Icons.Check className="h-4 w-4" />
                  </Button>
                )}
              </div>
            )}
            <h2>
              Price: <span className="font-medium">${listing?.price}</span>
            </h2>
          </div>
          <h2>
            Total:{" "}
            <span className="font-medium">
              $
              {listing?.price && startDate && endDate
                ? (listing?.price * differenceInDays(endOfDay(endDate), startDate)).toFixed(2)
                : 0}
            </span>
          </h2>
        </>
      )}
    </div>
  )
}
