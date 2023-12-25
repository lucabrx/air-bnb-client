import { useState } from "react"

import { categories } from "~/config/categories"
import { cn } from "~/lib/utils"
import { useListings } from "~/hooks/query/use-listings"
import { ListingCard } from "~/components/ui/listing-card"
import { Skeleton } from "~/components/ui/skeleton"
import { Layout } from "~/components/layouts/layout"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const { listings, metadata, isLoading } = useListings()

  return (
    <>
      <Categories selected={selectedCategory} setSelected={setSelectedCategory} />
      <Layout className="mt-0">
        {isLoading ? (
          <section className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
            {Array.from({ length: 15 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square h-full w-full rounded-md" />
            ))}
          </section>
        ) : (
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
        )}
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
      <div className="flex w-full items-center justify-between overflow-x-auto">
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
