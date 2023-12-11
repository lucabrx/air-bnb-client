import { useEffect, useRef, useState, type ChangeEvent } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { categories } from "~/config/categories"
import { API, cn } from "~/lib/utils"
import { useCreateListingModalContext } from "~/hooks/context/create-listing-modal-context"
import { Button } from "~/components/ui/button"
import { Input, inputVariants } from "~/components/ui/input"
import { Modal } from "~/components/ui/model"
import { Icons } from "~/components/icons"
import { Counter } from "~/components/models/create-listing-modal/counter"
import CountrySelect, { type CountrySelectValue } from "~/components/models/create-listing-modal/country-select"

const Map = dynamic(() => import("~/components/models/create-listing-modal/custom-map"), { ssr: false })

enum Steps {
  Description,
  Category,
  Location,
  Info,
  Images,
  Price,
}

const createListingValidator = z.object({
  category: z.string(),
  location: z.custom<CountrySelectValue>(),
  guests: z.number().min(1, "Please select a number of guests"),
  bedrooms: z.number().min(1, "Please select a number of bedrooms"),
  bathrooms: z.number().min(1, "Please select a number of bathrooms"),
  title: z.string().min(5, "Please enter a title, at least 5 characters long").optional(),
  description: z.string().min(10, "Please enter a description, at least 10 characters long").optional(),
  price: z.string().min(1, "Please enter a price, at least 1").optional(),
  images: z.array(z.string()).optional(),
})

type CreateListingValidator = z.infer<typeof createListingValidator>

export function CreateListingModal() {
  const { isOpen: isOpenListingModal, closeModal: closeListingModal } = useCreateListingModalContext()
  const [step, setStep] = useState<Steps>(Steps.Description)

  const [selectedCategory, setSelectedCategory] = useState<string>("Beachfront")
  const [selectedLocation, setSelectedLocation] = useState<CountrySelectValue>()
  const [guestCount, setGuestCount] = useState<number>(1)
  const [bedroomCount, setBedroomCount] = useState<number>(1)
  const [bathroomCount, setBathroomCount] = useState<number>(1)

  const inputFileRef = useRef<HTMLInputElement>(null)
  const [images, setImages] = useState<string[]>([])

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = event.target.files
    if (selectedFiles) {
      const files = Array.from(selectedFiles)

      for (const file of files) {
        const formData = new FormData()
        formData.append("file", file)
        const res = await API.post("/v1/upload/image", formData)
        const data = res.data as { url: string }
        setImages((prev) => [...prev, data.url])
      }
    }
  }

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateListingValidator>({
    resolver: zodResolver(createListingValidator),
  })

  const { isPending } = useMutation({})

  function onNext() {
    setStep((prev) => prev + 1)
  }
  function onBack() {
    if (step !== Steps.Description) {
      setStep((prev) => prev - 1)
      return
    }

    closeListingModal()
  }

  useEffect(() => {
    setValue("category", selectedCategory)
    setValue("guests", guestCount)
    setValue("bedrooms", bedroomCount)
    setValue("bathrooms", bathroomCount)
    setValue("images", images)
    if (selectedLocation) {
      setValue("location", selectedLocation)
    }
  }, [selectedCategory, setValue, selectedLocation, guestCount, bedroomCount, bathroomCount, images])

  function onSubmit(data: CreateListingValidator) {
    if (step !== Steps.Price) {
      onNext()
      return
    }
    console.log(data)
    reset()
  }

  return (
    <Modal
      disabled={isPending}
      onClose={closeListingModal}
      isOpen={isOpenListingModal}
      title="Airbnb your home"
      styles="lg:min-w-[40rem]"
    >
      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} id="create-listing" className="flex-1">
        {step === Steps.Description && (
          <>
            <section className="px-4 pt-4">
              <h2 className="text-2xl font-bold">Describe your Place</h2>
              <h3 className="mt-2 font-light text-muted-foreground">Tell guests about your place</h3>
            </section>
            <div className="grid gap-1.5 px-4 pt-4">
              <label>Name</label>
              <Input placeholder="Name" type="text" {...register("title")} />
              {errors.title && <span className="text-sm text-destructive">{errors.title.message}</span>}
            </div>
            <div className="grid gap-1.5 p-4 pt-2">
              <label>Description</label>
              <textarea
                placeholder="Description"
                className={cn(inputVariants(), "h-24 resize-none overflow-y-auto")}
                {...register("description")}
              />
              {errors.description && <span className="text-sm text-destructive">{errors.description.message}</span>}
            </div>
          </>
        )}
        {step === Steps.Category && (
          <>
            <section className="px-4 pt-4">
              <h2 className="text-2xl font-bold">Welcome back!</h2>
              <h3 className="mt-2 font-light text-muted-foreground">Sign in to your account to continue</h3>
            </section>
            {errors.category && <span className="px-4 text-sm text-destructive">{errors.category.message}</span>}

            <section className="grid max-h-[50vh] grid-cols-1 gap-3 overflow-y-auto p-4 md:grid-cols-2">
              {categories.map((item, i) => {
                const Icon = item.icon
                return (
                  <div onClick={() => setSelectedCategory(item.label)} key={i} className="col-span-1">
                    <div
                      className={cn(
                        "flex cursor-pointer flex-col gap-3 rounded-xl border-2 p-4 transition-all hover:border-foreground",
                        selectedCategory === item.label ? "border-foreground" : "border-muted"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-semibold">{item.label}</span>
                    </div>
                  </div>
                )
              })}
            </section>
          </>
        )}
        {step === Steps.Location && (
          <>
            <section className="px-4 pt-4">
              <h2 className="text-2xl font-bold">Location</h2>
              <h3 className="mt-2 font-light text-muted-foreground">Where is your place located</h3>
              <CountrySelect value={selectedLocation} onChange={(value) => setSelectedLocation(value)} />
              <Map center={selectedLocation?.latlng} />
            </section>
          </>
        )}
        {step === Steps.Info && (
          <>
            <section className="px-4 pt-4">
              <h2 className="text-2xl font-bold">Info About your Place</h2>
              <h3 className="mt-2 font-light text-muted-foreground">What can guests expect in your place</h3>
            </section>
            <section className="flex w-full flex-col items-start gap-2 p-4 ">
              <Counter
                title="Guests"
                subtitle="How many guests can your place accommodate"
                val={guestCount}
                onChange={setGuestCount}
              />
              <hr />
              <Counter
                title="Bedrooms"
                subtitle="How many bedrooms can guests use"
                val={bedroomCount}
                onChange={setBedroomCount}
              />
              <hr />
              <Counter
                title="Bathrooms"
                subtitle="How many bathrooms can guests use"
                val={bathroomCount}
                onChange={setBathroomCount}
              />
            </section>
          </>
        )}
        {step === Steps.Images && (
          <>
            <section className="px-4 pt-4">
              <h2 className="text-2xl font-bold">Upload Images</h2>
              <h3 className="mt-2 font-light text-muted-foreground">Upload images to attract guests</h3>
            </section>

            <section className="flex flex-col items-center justify-center p-4">
              <div
                onClick={() => inputFileRef.current?.click()}
                className="relative aspect-square h-1/2 w-1/2 rounded-md bg-muted hover:cursor-pointer"
              >
                <Icons.Plus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-pointer rounded-full bg-white p-1" />
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
              {images.map((image, i) => (
                <div key={i} className="relative aspect-square h-24 w-24 rounded-md bg-muted">
                  <Image
                    src={image}
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
              ))}
            </section>
          </>
        )}

        {step === Steps.Price && (
          <>
            <section className="px-4 pt-4">
              <h2 className="text-2xl font-bold">How much do you want to charge?</h2>
              <h3 className="mt-2 font-light text-muted-foreground">Set a price for your place</h3>
            </section>
            <section className="flex w-full flex-col items-start gap-2 p-4 ">
              <label>Price</label>
              <div className="relative w-full">
                <Icons.Dollar className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                <Input className="pl-8" disabled={isPending} type="number" {...register("price")} defaultValue={1} />
              </div>
            </section>
          </>
        )}
      </form>
      <div className="flex items-center justify-center gap-4 p-4">
        <Button isLoading={isPending} className="w-full" size="sm" variant="outline" onClick={onBack}>
          {step === Steps.Description ? "Cancel" : "Back"}
        </Button>
        <Button
          isLoading={isPending}
          disabled={isPending}
          form="create-listing"
          type="submit"
          className="w-full"
          size="sm"
        >
          {step === Steps.Price ? "Create" : "Next"}
        </Button>
      </div>
    </Modal>
  )
}
