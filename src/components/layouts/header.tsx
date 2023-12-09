import Image from "next/image"

import { Button } from "~/components/ui/button"
import { Icons } from "~/components/icons"

export function Header() {
  return (
    <div className="fixed top-0 w-full border-b border-border bg-background shadow-sm">
      <header className="container flex items-center justify-between gap-3 py-4 lg:gap-0">
        <Icons.Logo className="hidden text-primary sm:inline-block" />

        <article className="w-full cursor-pointer rounded-full border border-border py-2 shadow-sm transition hover:shadow-md sm:w-fit md:w-auto">
          <div className="flex flex-row items-center justify-between">
            <h2 className="px-6 text-sm font-semibold">Anywhere</h2>
            <h2 className="hidden flex-1 border-x px-6 text-center text-sm font-semibold sm:block">Any Week</h2>
            <div className="flex flex-row items-center gap-3 pl-6 pr-2 text-sm text-gray-600">
              <h2 className="hidden sm:block">Add Guests</h2>
              <div className="rounded-full bg-rose-500 p-2 text-white">
                <Icons.Search className="h-4 w-4" />
              </div>
            </div>
          </div>
        </article>

        <article className="flex flex-row items-center gap-3">
          <Button className="hidden rounded-full md:flex" variant="ghost" size="sm">
            Airbnb your home
          </Button>

          <div className="flex cursor-pointer flex-row items-center gap-3 rounded-full border border-border p-4 transition hover:shadow-md md:px-2 md:py-1">
            <Icons.Menu className="h-5 w-5 text-muted-foreground" />
            <div className="hidden md:block">
              <Image src="/default-user.png" alt="user avatar" width={32} height={32} className="rounded-full" />
            </div>
          </div>
        </article>
      </header>
    </div>
  )
}
