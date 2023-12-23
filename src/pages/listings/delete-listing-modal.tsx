import { useRouter } from "next/router"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { API } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Modal } from "~/components/ui/model"

type DeleteListingModalProps = {
  isOpen: boolean
  onClose: () => void
  listingId: string
}

export function DeleteListingModal({ isOpen, onClose, listingId }: DeleteListingModalProps) {
  const router = useRouter()
  const { mutate, isPending } = useMutation({
    mutationFn: () => API.delete("/v1/listings/delete/" + listingId),
    onSuccess: () => {
      void router.push("/properties")
      toast.success("Listing deleted successfully")
    },
    onError: () => {
      toast.error("Something went wrong, please try again later.")
    },
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      styles="lg:min-w-[30rem]"
      title="Delete your Property?"
      disabled={isPending}
    >
      <section className="p-4">
        <h2 className="text-xl font-semibold">Delete your Property?</h2>
        <p className="mt-1 text-muted-foreground">
          Are you sure you want to delete your property? This action is irreversible.
        </p>

        <div className="mt-4 flex w-full items-center justify-end gap-2">
          <Button disabled={isPending} variant="outline" size="sm" className="px-5" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => mutate()}
            variant="destructive"
            size="sm"
            className="px-5"
            isLoading={isPending}
            disabled={isPending}
          >
            Delete
          </Button>
        </div>
      </section>
    </Modal>
  )
}
