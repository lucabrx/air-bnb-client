import { useEffect, type RefObject } from "react"

type Event = MouseEvent | TouchEvent

export const useClickOutside = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: Event) => void,
  secRef?: RefObject<HTMLButtonElement>,
  disable = false
) => {
  useEffect(() => {
    if (disable) return
    const listener = (event: Event) => {
      const el = ref?.current
      if (!el || el.contains(event?.target as Node) || null) {
        return
      }

      if (secRef?.current?.contains(event?.target as Node)) {
        return
      }

      handler(event)
    }

    document.addEventListener("mousedown", listener)
    document.addEventListener("touchstart", listener)
    return () => {
      document.removeEventListener("mousedown", listener)
      document.removeEventListener("touchstart", listener)
    }
  }, [ref, handler, disable, secRef])
}
