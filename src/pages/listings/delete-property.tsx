import { Button } from "~/components/ui/button"

export function DeleteProperty() {
  return (
    <Button size="sm" variant="destructive" onClick={() => setDeleteModalOpen(true)}>
      Delete Property
    </Button>
  )
}
