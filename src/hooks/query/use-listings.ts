import { useRouter } from "next/router"
import { useInfiniteQuery } from "@tanstack/react-query"

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

async function fetchListings({ search, pageParam = 0 }: { search: string; pageParam: number }) {
  const res = await API.get<ListingType>(`/v1/listings?search=${search}&page=${pageParam}`)
  console.log(res.data.metadata)
  return res.data
}

export function useListings() {
  const router = useRouter()
  const search = router.query.search || ""

  const { fetchNextPage, data, isLoading, hasNextPage } = useInfiniteQuery({
    queryKey: ["listings", search],
    queryFn: ({ pageParam = 0 }) => fetchListings({ pageParam, search: search as string }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.metadata?.currentPage === lastPage.metadata?.lastPage) return undefined

      return Number(lastPage.metadata?.currentPage) + 1
    },
  })

  return {
    fetchNextPage,
    listings: data?.pages.flatMap((page) => page.listings) ?? [],
    isLoading,
    hasNextPage,
  }
}
