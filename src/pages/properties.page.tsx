import { useUserListings } from "~/hooks/query/use-user-listings"
import { ListingCard } from "~/components/ui/listing-card"
import { Skeleton } from "~/components/ui/skeleton"
import { Layout } from "~/components/layouts/layout"

export default function PropertiesPage() {
  const { listings, isLoading } = useUserListings()
  return (
    <Layout title="Properties">
      <section className="flex flex-1 flex-col items-center justify-center">
        <h1 className="w-full text-left text-2xl font-bold">Properties</h1>
        <p className="w-full text-muted-foreground">List of your properties</p>
      </section>
      {isLoading ? (
        <section className="mt-4 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ">
          {Array.from({ length: 15 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square h-full w-full rounded-md" />
          ))}
        </section>
      ) : !listings ? (
        <div className="mt-4 flex w-full flex-col items-center justify-center">
          <p className="text-muted-foreground">You don&apos;t have any properties.</p>
        </div>
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
  )
}
