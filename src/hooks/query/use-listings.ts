import { useRouter } from "next/router"
import { useQuery } from "@tanstack/react-query"
import type { AxiosError } from "axios"

import { API } from "~/lib/utils"
import { type Listing } from "~/hooks/query/use-user-listings"

export type Metadata = {
  currentPage?: number
  firstPage?: number
  lastPage?: number
  pageSize?: number
  totalRecords?: number
}

type ListingType = {
  listings: Listing[]
  metadata: Metadata
}

type CustomErrorType = {
  response: {
    data: {
      error: string
    }
  }
} & AxiosError

async function fetchListings(search: string) {
  const res = await API.get<ListingType>(`/v1/listings?search=${search}`)
  return res.data
}

export function useListings() {
  const router = useRouter()
  const search = router.query.search || ""
  const { data, isLoading, error, isError } = useQuery<ListingType, CustomErrorType>({
    queryKey: ["listings", search],
    queryFn: () => fetchListings(String(search)),
  })

  if (isError && error?.response?.status === 404) {
    void router.push("/404")
  }

  return {
    listings: data?.listings,
    metadata: data?.metadata,
    isLoading,
    error,
    isError,
  }
}
