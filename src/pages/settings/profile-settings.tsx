import { useEffect, useRef, useState, type ChangeEvent } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { API } from "~/lib/utils"
import { useSession } from "~/hooks/query/use-session"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Icons } from "~/components/icons"

const updateProfileValidator = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  image: z.string().optional(),
})
type UpdateProfileValidator = z.infer<typeof updateProfileValidator>
export function ProfileSettings() {
  const [image, setImage] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { session } = useSession()
  const [file, setFile] = useState<File | null>(null)
  const [hover, setHover] = useState(false)
  const [imageURL, setImageURL] = useState<string | null>(null)
  const inputFileRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const formData = new FormData()
      formData.append("file", selectedFile)
      const res = await API.post("/v1/upload/image", formData)
      const data = res.data as { url: string }
      setImageURL(data.url)
    }
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdateProfileValidator>({
    resolver: zodResolver(updateProfileValidator),
    defaultValues: {
      name: session?.name,
      image: session?.image ?? "",
    },
  })
  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdateProfileValidator) => API.patch("/v1/user", data),
    onSuccess: () => {
      reset()
      toast.success("Profile updated successfully.")
      void queryClient.invalidateQueries({ queryKey: ["session"] })
    },
    onError: () => {
      toast.error("Something went wrong, please try again.")
    },
  })

  useEffect(() => {
    if (imageURL) {
      setValue("image", imageURL)
    }
  }, [imageURL, setValue])

  function onSubmit(data: UpdateProfileValidator) {
    mutate(data)
  }

  useEffect(() => {
    setImage(file ? URL.createObjectURL(file) : session?.image ?? null)
  }, [file, session?.image])
  return (
    <section className="mt-4 border-y border-border py-4">
      <h3 className="text-xl font-semibold">Profile</h3>
      <p className="mt-2 text-muted-foreground">Update your profile information.</p>
      <p className="mt-4">Profile Picture</p>
      <div
        onClick={() => inputFileRef.current?.click()}
        className="relative h-fit w-fit rounded-md hover:cursor-pointer hover:bg-gray-700/10"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <Image
          src={image ?? "/default-user.png"}
          alt="user avatar"
          width={100}
          height={100}
          className="mt-2 aspect-square rounded-md"
        />
        {hover && (
          <Icons.Plus className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-white p-1 transition-transform" />
        )}{" "}
        <input
          ref={inputFileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => void handleFileChange(e)}
        />
      </div>
      {image && (
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => {
            setImage(null)
            setImageURL(null)
            setFile(null)
            if (inputFileRef.current) {
              inputFileRef.current.value = ""
            }
          }}
        >
          Remove
        </Button>
      )}

      <form onSubmit={(e) => void handleSubmit(onSubmit)(e)} className="mt-4 w-full">
        <label>Name</label>
        <Input
          autoFocus
          {...register("name")}
          type="text"
          placeholder="Name"
          className="mt-2"
          defaultValue={session?.name}
        />
        {errors.name && <p className="mt-0.5 text-sm text-destructive">{errors.name.message}</p>}
        <div className="mt-4 flex justify-end">
          <Button size="sm" disabled={isPending} isLoading={isPending} type="submit">
            Save
          </Button>
        </div>
      </form>
    </section>
  )
}
