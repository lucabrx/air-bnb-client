import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import { type AxiosError } from "axios"

import { API } from "~/lib/utils"

export type Location = {
  flag: string
  label: string
  lat: number
  lng: number
  region: string
  value: string
}

export type ListingImage = {
  id: number
  url: string
  listingId: number
}

export type Listing = {
  id: number
  createdAt: string
  bathrooms: number
  bedrooms: number
  guests: number
  category: string
  title: string
  description: string
  ownerId: number
  ownerName: string
  ownerPhoto: string
  price: number
  location: Location
  images: ListingImage[]
}

type ListingType = {
  listing: Listing
}

type CustomErrorType = {
  response: {
    data: {
      error: string
    }
  }
} & AxiosError

async function fetchListing(id: string) {
  const res = await API.get<ListingType>(`/v1/listings/${id}`)
  return res.data
}

export function useListing(id: string) {
  const router = useRouter()
  const { data, isLoading, error, isError } = useQuery<ListingType, CustomErrorType>({
    queryKey: ["listing", id],
    queryFn: () => fetchListing(id),
    retry: false,
  })

  if (isError && error?.response?.status === 404) {
    void router.push("/404")
  }

  return {
    listing: data?.listing,
    isLoading,
    error,
    isError,
  }
}
