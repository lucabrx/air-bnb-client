import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useInView } from "react-intersection-observer"

import { categories } from "~/config/categories"
import { cn } from "~/lib/utils"
import { useListings } from "~/hooks/query/use-listings"
import { Button } from "~/components/ui/button"
import { ListingCard } from "~/components/ui/listing-card"
import { Skeleton } from "~/components/ui/skeleton"
import { Layout } from "~/components/layouts/layout"

export default function HomePage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const { fetchNextPage, hasNextPage, isLoading, listings } = useListings()

  const { ref: bottomRef, inView: bottomInView } = useInView({
    threshold: 0.5,
  })

  useEffect(() => {
    if (bottomInView && hasNextPage) {
      void fetchNextPage()
    }
  }, [fetchNextPage, bottomInView, hasNextPage])

  // <div className="mt-4 flex w-full items-center justify-center py-3 ">
  //             <div className="container flex w-full items-center justify-between overflow-x-auto">
  //               <h1 className="text-2xl font-bold">No listings found</h1>
  //             </div>
  //           </div>

  return (
    <>
      <Categories selected={selectedCategory} setSelected={setSelectedCategory} />
      <Layout className="mt-0 pb-10">
        {isLoading ? (
          <section className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
            {Array.from({ length: 20 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square h-full w-full rounded-md" />
            ))}
          </section>
        ) : listings.length > 1 ? (
          <section className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
            {listings?.map((listing) => (
              <ListingCard
                key={listing.id}
                href={`/listings/${listing.id}`}
                images={listing.images}
                region={listing.location.region}
                label={listing.title}
                price={listing.price}
              />
            ))}
          </section>
        ) : (
          <div className="mt-4 flex w-full items-center justify-center py-3 ">
            <div className=" flex w-full flex-col items-center justify-center gap-3">
              <h1 className="text-2xl font-bold">No listings found</h1>
              <Button onClick={() => void router.push("/")} variant="outline" size="sm">
                Reset Search
              </Button>
            </div>
          </div>
        )}
        <div ref={bottomRef} className="invisible" />
      </Layout>
    </>
  )
}

type CategoriesProps = {
  selected: string
  setSelected: (selected: string) => void
}

export function Categories({ selected, setSelected }: CategoriesProps) {
  return (
    <div className=" mt-16 flex w-full items-center justify-center py-3 ">
      <div className="container flex w-full items-center justify-between overflow-x-auto">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              onClick={() => setSelected(category.label)}
              key={category.label}
              className={cn(
                "flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 p-3 text-muted-foreground transition-colors hover:border-b-2 hover:text-foreground group-hover:border-b-2 group-hover:text-foreground",
                selected === category.label && "border-b-2 border-foreground text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "group h-6 w-6 text-muted-foreground hover:text-foreground group-hover:text-foreground",
                  selected === category.label && "text-foreground"
                )}
              />
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/*
{listings?.map((listing) => (
              <ListingCard
                key={listing.id}
                href={`/listings/${listing.id}`}
                images={listing.images}
                region={listing.location.region}
                label={listing.title}
                price={listing.price}
              />
            ))}
 */
