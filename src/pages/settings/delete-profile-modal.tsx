import { useState } from "react"
import { useRouter } from "next/router"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { API } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Modal } from "~/components/ui/modal"

export function DeleteProfileModal() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const { mutate, isPending } = useMutation({
    mutationFn: () => API.delete("/v1/user"),
    onSuccess: () => {
      toast.success("Account deleted successfully.")
      void router.push("/")
    },
    onError: () => {
      toast.error("Something went wrong, please try again.")
    },
  })
  return (
    <>
      <section className=" border-b border-border py-4">
        <h3 className="text-xl font-semibold">Delete </h3>
        <p className="mt-2 text-muted-foreground">
          Permanently delete your account. This action cannot be undone, please take this action carefully.
        </p>
        <div className="flex justify-end pt-3">
          <Button onClick={() => setIsOpen(true)} size="sm" variant="destructive">
            Delete Account
          </Button>
        </div>
      </section>

      <Modal onClose={() => setIsOpen(false)} isOpen={isOpen} title="Delete Account">
        <div className="p-4">
          <h2 className="text-xl font-semibold">Are you sure?</h2>
          <p className="mt-2 text-muted-foreground">
            This action cannot be undone, please take this action carefully, you will lose all your data.
          </p>

          <div className="flex items-center justify-end gap-3">
            <Button onClick={() => setIsOpen(false)} size="sm" variant="outline">
              Cancel
            </Button>
            <Button onClick={() => mutate()} size="sm" variant="destructive" isLoading={isPending}>
              Delete Account
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}
