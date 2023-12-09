import { create } from "zustand"

type Props = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

export const useRegisterUserModalContext = create<Props>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}))
