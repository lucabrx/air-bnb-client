import { useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { API } from "~/lib/utils"
import { type Listing } from "~/hooks/query/use-user-listings"

export type Booking = {
  checkIn: Date
  checkOut: Date
  createdAt: Date
  guestId: number
  id: number
  listingId: number
  price: number
  total: number
  listing: Listing
}
type BookingType = {
  bookings: Booking[]
}

type CustomErrorType = {
  response: {
    data: {
      error: string
    }
  }
} & AxiosError

async function fetchBookings() {
  const res = await API.get<BookingType>("v1/bookings/user-bookings")
  return res.data
}

export function useUserBookings() {
  const { data, isLoading, error, isError } = useQuery<BookingType, CustomErrorType>({
    queryKey: ["user-bookings"],
    queryFn: fetchBookings,
    retry: false,
  })

  return {
    bookings: data?.bookings ?? [],
    isLoading,
    error,
    isError,
  }
}
