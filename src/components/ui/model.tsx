import { useCallback, useEffect, useRef, type ReactNode } from "react"

import { cn } from "~/lib/utils"
import { useClickOutside } from "~/hooks/use-click-outside"
import useLockOverflow from "~/hooks/use-lock-overflow"
import { Button } from "~/components/ui/button"
import { Icons } from "~/components/icons"

type ModalProps = {
  children: ReactNode
  disabled?: boolean
  onClose: () => void
  isOpen: boolean
  title: string
  styles?: string
}

export function Modal({ children, onClose, disabled, isOpen, styles, title }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  useClickOutside(modalRef, onClose)
  useLockOverflow(isOpen)

  const handleClose = useCallback(() => {
    if (disabled) return

    onClose()
  }, [disabled, onClose])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setTimeout(() => {
          onClose()
        }, 300)
      }
    }

    if (isOpen && !disabled) {
      window.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen, onClose, disabled])

  if (!isOpen) return null
  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto",
        isOpen ? "bg-background/70 backdrop-blur-sm" : "bg-transparent"
      )}
    >
      <div className="relative mx-auto flex h-full w-full items-end md:h-auto md:w-4/6 lg:h-auto lg:w-auto">
        <div
          ref={modalRef}
          className={cn(
            "relative h-fit w-full flex-col items-end rounded-t-3xl border border-border bg-card shadow-lg md:h-auto md:rounded-md md:rounded-xl  lg:h-auto lg:w-auto",
            styles
          )}
        >
          <div className="relative flex w-full items-center justify-center border-b border-border px-4 py-4">
            <Button
              size="icon"
              variant="ghost"
              className="absolute left-3.5 top-3.5 h-8 w-8 cursor-pointer rounded-full"
              onClick={handleClose}
            >
              <Icons.Close className="h-5 w-5 text-foreground/80" />
            </Button>
            <h2 className="w-full text-center font-semibold">{title}</h2>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
