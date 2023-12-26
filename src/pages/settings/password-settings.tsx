import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { API } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

const updatePasswordValidator = z.object({
  oldPassword: z.string().min(8, "Password must be at least 8 characters long"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
})
type UpdatePasswordValidator = z.infer<typeof updatePasswordValidator>
export function PasswordSettings() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdatePasswordValidator>({
    resolver: zodResolver(updatePasswordValidator),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: UpdatePasswordValidator) => API.patch("/v1/user/password", data),
    onSuccess: () => {
      reset()
      toast.success("Password updated successfully.")
    },
    onError: () => {
      toast.error("Something went wrong, please try again.")
    },
  })

  function onSubmit(data: UpdatePasswordValidator) {
    mutate(data)
  }

  return (
    <section className=" border-b border-border py-4">
      <h3 className="text-xl font-semibold">Password</h3>
      <p className="mt-2 text-muted-foreground">Update your password.</p>
      <form className="mt-4 space-y-2" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
        <div className="grid gap-1.5">
          <label htmlFor="oldPassword">Old Password</label>
          <Input placeholder="************" type="password" id="oldPassword" {...register("oldPassword")} />
          {errors.oldPassword && <p className="text-destructive">{errors.oldPassword.message}</p>}
        </div>
        <div className="grid gap-1.5">
          <label htmlFor="newPassword">New Password</label>
          <Input placeholder="************" type="password" id="newPassword" {...register("newPassword")} />
          {errors.newPassword && <p className="text-destructive">{errors.newPassword.message}</p>}
        </div>
        <div className="flex justify-end pt-3">
          <Button size="sm" disabled={isPending} isLoading={isPending} type="submit">
            Save
          </Button>
        </div>
      </form>
    </section>
  )
}
