import { create } from "zustand"

type Props = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useLoginUserModalContext = create<Props>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))
