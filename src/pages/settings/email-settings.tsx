import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { API } from "~/lib/utils"
import { useSession } from "~/hooks/query/use-session"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

const requestChangeEmailValidator = z.object({
  email: z.string().email("Invalid email address"),
})
type RequestChangeEmailValidator = z.infer<typeof requestChangeEmailValidator>

const changeEmailValidator = z.object({
  verifyCode: z.string().min(7, "Code must be at least 7 characters"),
})
type ChangeEmailValidator = z.infer<typeof changeEmailValidator>

export function EmailSettings() {
  const { session } = useSession()
  const queryClient = useQueryClient()
  const [hasCode, setHasCode] = useState(false)
  const [email, setEmail] = useState("")
  const {
    register: registerRequestChangeEmail,
    handleSubmit: handleSubmitRequestChangeEmail,
    formState: { errors: errorsRequestChangeEmail },
    reset: resetRequestChangeEmail,
  } = useForm<RequestChangeEmailValidator>({
    resolver: zodResolver(requestChangeEmailValidator),
  })

  const { mutate: requestChangeEmail, isPending: isPendingRequestChangeEmail } = useMutation({
    mutationFn: (data: RequestChangeEmailValidator) => API.post("/v1/user/change-email", data),
    onSuccess: () => {
      resetRequestChangeEmail()
      toast.success("Please check your email for the code.")
      setHasCode(true)
    },
    onError: () => {
      toast.error("Something went wrong, please try again.")
    },
  })

  function onSubmitRequestChangeEmail(data: RequestChangeEmailValidator) {
    setEmail(data.email)
    requestChangeEmail(data)
  }

  const {
    register: registerChangeEmail,
    handleSubmit: handleSubmitChangeEmail,
    formState: { errors: errorsChangeEmail },
    reset: resetChangeEmail,
  } = useForm<ChangeEmailValidator>({
    resolver: zodResolver(changeEmailValidator),
  })

  const { mutate: changeEmail, isPending: isPendingChangeEmail } = useMutation({
    mutationFn: (data: ChangeEmailValidator) => API.post(`/v1/user/change-email/verify/${email}`, data),
    onSuccess: () => {
      resetChangeEmail()
      toast.success("Email updated successfully.")
      setHasCode(false)
    },
    onError: (error: AxiosError) => {
      if (error.response?.status === 401) {
        toast.error("Invalid code, please try again.")
        return
      }
      toast.error("Something went wrong, please try again.")
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ["session"] })
    },
  })

  function onSubmitChangeEmail(data: ChangeEmailValidator) {
    changeEmail(data)
  }

  return (
    <section className=" border-b border-border py-4">
      <h3 className="text-xl font-semibold">
        Email
        <span className="pb-1 text-sm text-muted-foreground"> ({session?.email})</span>
      </h3>
      <p className="mt-2 text-muted-foreground">Change your email.</p>
      {hasCode ? (
        <form className="mt-4 space-y-2" onSubmit={(e) => void handleSubmitChangeEmail(onSubmitChangeEmail)(e)}>
          <div className="grid gap-1.5">
            <label htmlFor="code">Code</label>
            <Input id="code" type="text" placeholder="das-xcc" {...registerChangeEmail("verifyCode")} />
            {errorsChangeEmail.verifyCode && <p className="text-error">{errorsChangeEmail.verifyCode.message}</p>}
          </div>
          <div className="flex justify-end pt-3">
            <Button disabled={isPendingChangeEmail} isLoading={isPendingChangeEmail} type="submit">
              Change Email
            </Button>
          </div>
        </form>
      ) : (
        <form
          className="mt-4 space-y-2"
          onSubmit={(e) => void handleSubmitRequestChangeEmail(onSubmitRequestChangeEmail)(e)}
        >
          <div className="grid gap-1.5">
            <label htmlFor="email">Email</label>
            <Input id="email" type="email" placeholder="john@example.com" {...registerRequestChangeEmail("email")} />
            {errorsRequestChangeEmail.email && (
              <p className="text-sm text-destructive">{errorsRequestChangeEmail.email.message}</p>
            )}
          </div>
          <div className="flex justify-end pt-3">
            <Button disabled={isPendingRequestChangeEmail} isLoading={isPendingRequestChangeEmail} type="submit">
              Change Email
            </Button>
          </div>
        </form>
      )}
    </section>
  )
}
