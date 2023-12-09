import { useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { useLoginUserModalContext } from "~/hooks/context/login-user-modal-context"
import { useRegisterUserModalContext } from "~/hooks/context/register-user-modal-context"
import { useSession } from "~/hooks/query/use-session"
import { useClickOutside } from "~/hooks/use-click-outside"
import { Button } from "~/components/ui/button"
import { Icons } from "~/components/icons"

const menuItems = [
  {
    name: "Settings",
    href: "/settings",
  },
]

export function Header() {
  const [showDropdown, setShowDropdown] = useState<boolean>(false)
  const showDropdownContentRef = useRef<HTMLDivElement>(null)
  const showDropdownTriggerRef = useRef<HTMLButtonElement>(null)
  useClickOutside(showDropdownContentRef, () => setShowDropdown(false), showDropdownTriggerRef)
  const { openModal: openRegisterModal } = useRegisterUserModalContext()
  const { openModal: openLoginModal } = useLoginUserModalContext()
  const { session } = useSession()

  return (
    <div className="fixed top-0 w-full border-b border-border bg-background shadow-sm">
      <header className="container flex items-center justify-between gap-3 py-4 lg:gap-0" aria-label="Website Header">
        <button className="hidden text-primary sm:inline-block">
          <Icons.Logo />
        </button>

        <article
          className="w-full cursor-pointer rounded-full border border-border py-2 shadow-sm transition hover:shadow-md sm:w-fit md:w-auto"
          aria-label="Search and Navigation"
        >
          <div className="flex flex-row items-center justify-between">
            <h2 className="px-6 text-sm font-semibold">Anywhere</h2>
            <h2 className="hidden flex-1 border-x px-6 text-center text-sm font-semibold sm:block">Any Week</h2>
            <div className="flex flex-row items-center gap-3 pl-6 pr-2 text-sm text-gray-600">
              <h2 className="hidden sm:block">Add Guests</h2>
              <div
                className="rounded-full bg-rose-500 p-2 text-white"
                aria-label="Search Button"
                role="button"
                tabIndex={0}
              >
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
            aria-label="User Menu"
            role="button"
            tabIndex={0}
          >
            <Icons.Menu className="h-5 w-5 text-muted-foreground" />
            <div className="hidden md:block">
              <Image src="/default-user.png" alt="user avatar" width={32} height={32} className="rounded-full" />
            </div>
            {showDropdown && (
              <div
                ref={showDropdownContentRef}
                className="absolute right-0 top-16 w-[12rem] overflow-hidden rounded-xl bg-card text-sm shadow-md md:top-12 lg:min-w-[10rem]"
              >
                <div className="flex  w-full cursor-pointer flex-col">
                  {session ? (
                    menuItems.map((item) => (
                      <Link
                        href={item.href}
                        key={item.name}
                        className="w-full px-4 py-3 text-left font-semibold transition hover:bg-muted"
                      >
                        {item.name}
                      </Link>
                    ))
                  ) : (
                    <>
                      <button
                        onClick={openLoginModal}
                        className="w-full px-4 py-3 text-left font-semibold transition hover:bg-muted"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={openRegisterModal}
                        className="w-full px-4 py-3 text-left font-semibold transition hover:bg-muted"
                      >
                        Sign Up
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </article>
        </section>
      </header>
    </div>
  )
}
