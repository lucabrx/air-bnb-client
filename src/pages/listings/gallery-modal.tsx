import { useEffect, useRef, useState, type ChangeEvent } from "react"
import Image from "next/image"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

import { API } from "~/lib/utils"
import { type ListingImage } from "~/hooks/query/use-listing"
import { Button } from "~/components/ui/button"
import { Modal } from "~/components/ui/model"
import { Icons } from "~/components/icons"

type GalleryModalProps = {
  isOpen: boolean
  onClose: () => void
  images: ListingImage[] | undefined
  listingId: string
}

export function GalleryModal({ isOpen, onClose, images, listingId }: GalleryModalProps) {
  const queryClient = useQueryClient()
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [imagesArr, setImages] = useState<ListingImage[]>([])
  const [uploadArr, setUploadArr] = useState<string[]>([])

  useEffect(() => {
    if (images) {
      setImages(images)
    }
  }, [images])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files
    if (selectedFiles) {
      const files = Array.from(selectedFiles)

      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        const res = await API.post("/v1/upload/image", formData)
        const data = res.data as { url: string }
        const imagePayload: ListingImage = {
          url: data.url,
          listingId: Number(listingId),
          id: Math.floor(Math.random() * 1000000),
        }
        setImages((prev) => [...prev, imagePayload])
        setUploadArr((prev) => [...prev, data.url])
      }
    }
  }

  const { mutate: uploadImage, isPending } = useMutation({
    mutationFn: () =>
      API.post("/v1/listings/images/" + listingId, {
        images: uploadArr,
      }),
    onSuccess: () => {
      toast.success("Images uploaded successfully")
      void queryClient.invalidateQueries({ queryKey: ["listing", listingId] })
    },
    onError: () => {
      toast.error("Something went wrong, please try again later.")
    },
  })

  async function handleDeleteImageHandler() {
    // compare imagesArr and images delete everything that is not in imagesArr
    if (!images) return
    try {
      if (imagesArr.length < images.length) {
        for (const image of images) {
          if (!imagesArr.includes(image)) {
            const res = await API.delete("/v1/listings/images/" + image.id)
            if (res.status === 200) {
              void queryClient.invalidateQueries({ queryKey: ["listing", listingId] })
            }
          }
        }
      }
      toast.success("Image deleted successfully")
    } catch (e) {
      toast.error("Something went wrong, please try again later.")
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} styles="lg:min-w-[30rem] lg:max-w-[30rem]" title="Gallery">
      <div className="absolute right-4 top-4 flex items-center justify-center gap-2">
        {imagesArr.length < Number(images?.length) && (
          <Button
            isLoading={isPending}
            disabled={isPending}
            size="icon_sm"
            variant="destructive"
            onClick={() => void handleDeleteImageHandler()}
            className="h-7 w-7 p-0"
          >
            <Icons.Trash className="h-4 w-4" />
          </Button>
        )}
        {uploadArr.length > 0 && (
          <Button
            isLoading={isPending}
            disabled={isPending}
            size="icon_sm"
            onClick={() => uploadImage()}
            className="h-7 w-7 p-0"
          >
            <Icons.Check className="h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="p-4">
        <section className="flex flex-col items-center justify-center p-4">
          <div
            onClick={() => inputFileRef.current?.click()}
            className="relative aspect-square h-1/2 w-1/2 rounded-md bg-muted hover:cursor-pointer"
          >
            <Icons.Plus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  cursor-pointer rounded-full bg-white p-1" />
            <input
              ref={inputFileRef}
              type="file"
              accept="image/*"
              className="hidden"
              multiple
              onChange={(e) => void handleFileChange(e)}
            />
          </div>
        </section>
        <section className="flex max-w-[40rem] gap-2 overflow-x-scroll p-4">
          {images || imagesArr.length > 0
            ? imagesArr.map((image, i) => (
                <div key={i} className="relative aspect-square h-24 w-24 rounded-md bg-muted">
                  <Image
                    src={image.url}
                    alt="image"
                    className="aspect-square rounded-md object-cover "
                    width={100}
                    height={100}
                  />
                  <Icons.Close
                    onClick={() => {
                      setImages((prev) => prev.filter((_, index) => index !== i))
                    }}
                    className="absolute right-1 top-1 h-5 w-5 cursor-pointer rounded-full bg-black/50 text-white"
                  />
                </div>
              ))
            : null}
        </section>
      </div>
    </Modal>
  )
}
