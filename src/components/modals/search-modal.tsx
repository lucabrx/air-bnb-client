import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"

import { useClickOutside } from "~/hooks/use-click-outside"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Icons } from "~/components/icons"

type SearchModalProps = {
  open: boolean
  onClose: () => void
}
export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter()
  const [search, setSearch] = useState<string>("")
  const modalRef = useRef<HTMLDivElement>(null)
  useClickOutside(modalRef, onClose)

  const handleSearch = useCallback(() => {
    void router.push({
      pathname: "/",
      query: { ...router.query, search },
    })
    setSearch("")
    onClose()
  }, [router, search, onClose])

  useEffect(() => {
    if (!open) return
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        handleSearch()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [search, handleSearch, open])

  if (!open) return null
  return (
    <div className="fixed inset-0  z-20 flex w-full items-start justify-center bg-black/90 px-8">
      <div ref={modalRef} className="mx-auto mt-12 flex w-full max-w-lg rounded-md bg-card">
        <Input
          autoFocus
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search"
          variant="empty"
        />
        <Button onClick={handleSearch} className="h-10 w-10 rounded-l-none p-0">
          <Icons.Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
