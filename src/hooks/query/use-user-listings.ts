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
  listings: Listing[]
}

type CustomErrorType = {
  response: {
    data: {
      error: string
    }
  }
} & AxiosError

async function fetchListings() {
  const res = await API.get<ListingType>("v1/listings/user-listings")
  return res.data
}

export function useUserListings() {
  const { data, isLoading, error, isError } = useQuery<ListingType, CustomErrorType>({
    queryKey: ["user-listings"],
    queryFn: fetchListings,
    retry: false,
  })

  return {
    listings: data?.listings,
    isLoading,
    error,
    isError,
  }
}
