import { useRef, useState } from "react"
import Image from "next/image"

import { useClickOutside } from "~/hooks/use-click-outside"
import { Button } from "~/components/ui/button"
import { Icons } from "~/components/icons"

export function Header() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const showDropdownContentRef = useRef<HTMLDivElement>(null)
  const showDropdownTriggerRef = useRef<HTMLButtonElement>(null)
  useClickOutside(showDropdownContentRef, () => setShowDropdown(false), showDropdownTriggerRef)
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

        <section className="flex flex-row items-center gap-3">
          <Button className="hidden rounded-full md:flex" variant="ghost" size="sm">
            Airbnb your home
          </Button>

          <article
            ref={showDropdownTriggerRef}
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative flex cursor-pointer flex-row items-center gap-3 rounded-full border border-border p-4 transition hover:shadow-md md:px-2 md:py-1"
          >
            <Icons.Menu className="h-5 w-5 text-muted-foreground" />
            <div className="hidden md:block">
              <Image src="/default-user.png" alt="user avatar" width={32} height={32} className="rounded-full" />
            </div>
            {showDropdown && (
              <div
                ref={showDropdownContentRef}
                className="absolute right-0 top-12 w-[40vw] overflow-hidden rounded-xl bg-card text-sm shadow-md md:w-3/4 lg:min-w-[10rem]"
              >
                <div className="flex  w-full cursor-pointer flex-col">
                  <button className="w-full px-4 py-3 font-semibold transition hover:bg-muted md:text-left">
                    Sign In
                  </button>
                  <button className="w-full px-4 py-3 font-semibold transition hover:bg-muted md:text-left">
                    Sign Up
                  </button>
                </div>
              </div>
            )}
          </article>
        </section>
      </header>
    </div>
  )
}
