import { create } from "zustand"

type Props = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useCreateListingModalContext = create<Props>((set) => ({
  isOpen: true,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))
