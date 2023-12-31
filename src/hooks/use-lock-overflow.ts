import { useEffect } from "react"

const useLockOverflow = (state: boolean) => {
  useEffect(() => {
    if (state) {
      document.body.style.overflow = "HIDDEN"
    }
    return () => {
      document.body.style.overflow = "AUTO"
    }
  }, [state])
}

export default useLockOverflow
