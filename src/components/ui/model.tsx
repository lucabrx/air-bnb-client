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
  styles?: string
}

export function Modal({ children, onClose, disabled, isOpen, styles }: ModalProps) {
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
      <div className="relative mx-auto h-full w-full md:h-auto md:w-4/6 lg:h-auto lg:w-auto">
        <div
          className={`h-full duration-300 
    ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
        >
          <div
            ref={modalRef}
            className={cn(
              "relative flex h-full w-full flex-col border border-border  bg-card shadow-lg md:h-auto md:rounded-md  lg:h-auto lg:w-auto",
              styles
            )}
          >
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-3 top-3 h-6 w-6 cursor-pointer"
              onClick={handleClose}
            >
              <Icons.Close className="h-4 w-4" />
            </Button>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
