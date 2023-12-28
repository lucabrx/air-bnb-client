import { Skeleton } from "~/components/ui/skeleton"

export function PageLoadingSkeleton() {
  return (
    <>
      <section className="text-start">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="mt-2 h-6 w-3/5" />
        <Skeleton className="mt-6 aspect-video w-full" />
      </section>

      <section className="flex flex-col md:flex-row-reverse md:gap-8">
        <Skeleton className="mt-2 aspect-square max-h-[40rem] w-full" />
        <div className="w-full">
          <article className="flex w-full flex-col justify-start gap-2 border-b border-border py-4">
            <div className="flex w-full items-center justify-start gap-2">
              <Skeleton className="h-6 w-3/5" />
              <Skeleton className="aspect-square h-10 rounded-full" />
            </div>
            <div className="flex w-full items-center justify-start gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </article>
          <article className="flex w-full items-start justify-start gap-2 border-b border-border py-4">
            <div className="flex  items-center justify-start gap-2">
              <Skeleton className="aspect-square h-12 rounded-full" />
            </div>
            <div className="flex  flex-col items-start justify-start gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-48" />
            </div>
          </article>
          <article className="flex w-full flex-col items-start justify-start gap-2 border-b border-border py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square h-4 w-full rounded-full" />
            ))}
          </article>

          <Skeleton className="mt-2 aspect-square w-full" />
        </div>
      </section>
    </>
  )
}
