import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import type { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { API } from "~/lib/utils"
import { useLoginUserModalContext } from "~/hooks/context/login-user-modal-context"
import { useRegisterUserModalContext } from "~/hooks/context/register-user-modal-context"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Modal } from "~/components/ui/model"
import { Icons } from "~/components/icons"

const loginUserValidator = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
})

type LoginUserForm = z.infer<typeof loginUserValidator>

type CustomErrorRegister = {
  response: {
    data: {
      error: string
    }
  }
} & AxiosError

export function LoginUserModal() {
  const { isOpen, closeModal } = useLoginUserModalContext()
  const { openModal } = useRegisterUserModalContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<LoginUserForm>({
    resolver: zodResolver(loginUserValidator),
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: Omit<LoginUserForm, "confirmPassword">) => API.post("/v1/auth/login", data),
    onSuccess: () => {
      reset()
      closeModal()
      toast.success("Welcome back!")
    },
    onError: (error: CustomErrorRegister) => {
      console.log(error.response.data)
      if (error.response.status === 404) {
        setError("email", {
          type: "manual",
          message: "Some of your credentials are incorrect",
        })
        setError("password", {
          type: "manual",
          message: "Some of your credentials are incorrect",
        })
        return
      }

      if (error.response.status === 403) {
        toast.error("You account is not verified. Please check your email for a verification code.")
        closeModal()
        return
      }

      if (error.response.status === 401) {
        setError("password", {
          type: "manual",
          message: "Please provide valid password",
        })
        return
      }

      toast.error("Something went wrong, please try again later")
    },
  })

  function onSubmit(data: LoginUserForm) {
    mutate({
      email: data.email,
      password: data.password,
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      styles="lg:min-w-[40rem]"
      title="Sign In"
      aria-label="Sign In User Modal"
    >
      <div className="h-[calc(100vh-4rem)] overflow-y-scroll sm:h-auto sm:overflow-y-auto">
        <section className="px-4 pt-4">
          <h2 className="text-2xl font-bold">Welcome back!</h2>
          <h3 className="mt-2 font-light text-muted-foreground">Sign in to your account to continue</h3>
        </section>
        <div className="w-full border-b border-border">
          <section className="p-4">
            <form
              onSubmit={(e) => void handleSubmit(onSubmit)(e)}
              className="space-y-2"
              aria-labelledby="signInFormHeading"
            >
              <div className="grid gap-1.5">
                <label htmlFor="email">Email</label>
                <Input {...register("email")} type="email" id="email" placeholder="malkovich@example.com" />
                {errors?.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
              <div className="grid gap-1.5">
                <label htmlFor="password">Password</label>
                <Input {...register("password")} type="password" id="password" placeholder="*************" />
                {errors?.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
              </div>
              <div className="pt-4">
                <Button disabled={isPending} isLoading={isPending} type="submit" className="w-full">
                  Sign In
                </Button>
              </div>
            </form>
          </section>
        </div>

        <section className="grid gap-2 p-4">
          <Button variant="outline" className="w-full">
            <Icons.Google className="mr-2 h-5 w-5" /> Sign in with Google
          </Button>
          <Button variant="outline" className="w-full">
            <Icons.GitHub className="mr-2 h-5 w-5" /> Sign in with Github
          </Button>
        </section>
        <section className="p-4">
          <div className="flex flex-row items-center justify-center gap-2">
            <p className="text-sm text-muted-foreground">Don&apos;t have an account?</p>
            <button
              onClick={() => {
                closeModal()
                openModal()
              }}
              className="cursor-pointer text-sm hover:underline"
            >
              Sign Up
            </button>
          </div>
        </section>
      </div>
    </Modal>
  )
}
