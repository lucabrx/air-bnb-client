import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { type AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { API, BASE_URL, capitalize, cn } from "~/lib/utils"
import { useLoginUserModalContext } from "~/hooks/context/login-user-modal-context"
import { useRegisterUserModalContext } from "~/hooks/context/register-user-modal-context"
import { Button, buttonVariants } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Modal } from "~/components/ui/model"
import { Icons } from "~/components/icons"

const registerUserValidator = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
type RegisterUserForm = z.infer<typeof registerUserValidator>

const verifyUserValidator = z.object({
  code: z.string().min(7, "Code must be at least 7 characters long"),
})
type VerifyUserForm = z.infer<typeof verifyUserValidator>

type CustomErrorRegister = {
  response: {
    data: {
      error: {
        email: string
      }
    }
  }
} & AxiosError

enum Steps {
  REGISTER,
  VERIFY,
}
export function RegisterUserModal() {
  const [step, setStep] = useState<Steps>(Steps.REGISTER)
  const [userId, setUserId] = useState<number | null>(null)
  const { isOpen, closeModal } = useRegisterUserModalContext()
  const { openModal } = useLoginUserModalContext()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<RegisterUserForm>({
    resolver: zodResolver(registerUserValidator),
  })

  const { mutate: registerUser, isPending: isPendingRegister } = useMutation({
    mutationFn: (data: Omit<RegisterUserForm, "confirmPassword">) => API.post("/v1/auth/register", data),
    onSuccess: ({ data }: { data: { userId: number } }) => {
      setUserId(data.userId)
      setStep(Steps.VERIFY)
      reset()
      toast.success("Please check your email to verify your account")
    },
    onError: (error: CustomErrorRegister) => {
      if (error.response.data.error.email) {
        toast.error(capitalize(error.response.data.error.email))
        setError("email", {
          type: "manual",
          message: capitalize(error.response.data.error.email),
        })
        return
      }

      toast.error("Something went wrong, please try again later")
    },
  })

  function onSubmit(data: RegisterUserForm) {
    registerUser({
      name: data.name,
      email: data.email,
      password: data.password,
    })
  }

  return (
    <Modal
      disabled={isPendingRegister}
      isOpen={isOpen}
      onClose={closeModal}
      styles="lg:min-w-[40rem] "
      title="Sign Up"
      aria-label="Register User Modal"
    >
      {step === Steps.REGISTER && (
        <div className="h-[calc(100vh-4rem)] overflow-y-scroll sm:h-auto sm:overflow-y-auto">
          <section className="px-4 pt-4">
            <h2 className="text-2xl font-bold">Welcome to Airbnb</h2>
            <h3 className="mt-2 font-light text-muted-foreground">Create an account to get started</h3>
          </section>
          <div className="w-full border-b border-border">
            <section className="p-4">
              <form
                onSubmit={(e) => void handleSubmit(onSubmit)(e)}
                className="space-y-2"
                aria-labelledby="registerFormHeading"
              >
                <div className="grid gap-1.5">
                  <label htmlFor="name">Name</label>
                  <Input autoFocus {...register("name")} type="text" id="name" placeholder="John Malkovich" />
                  {errors?.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="email">Email</label>
                  <Input {...register("email")} type="email" id="email" placeholder="malkovich@example.com" />
                  {errors?.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="password">Password</label>
                  <Input {...register("password")} id="password" type="password" placeholder="*************" />
                  {errors?.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>
                <div className="grid gap-1.5">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <Input
                    {...register("confirmPassword")}
                    type="password"
                    id="confirmPassword"
                    placeholder="*************"
                  />
                  {errors?.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <div className="pt-4">
                  <Button disabled={isPendingRegister} isLoading={isPendingRegister} type="submit" className="w-full">
                    Sign Up
                  </Button>
                </div>
              </form>
            </section>
          </div>

          <section className="grid gap-2 p-4">
            <Button disabled={isPendingRegister} variant="outline" className="w-full">
              <Icons.Google className="mr-2 h-5 w-5" /> Sign in with Google
            </Button>
            <a
              onClick={() => {
                toast.info("Welcome user!")
                closeModal()
              }}
              href={`${BASE_URL}/v1/auth/github/login`}
              className={cn(
                buttonVariants({
                  variant: "outline",
                }),
                "w-full"
              )}
            >
              <Icons.GitHub className="mr-2 h-5 w-5" /> Sign in with Github
            </a>
          </section>

          <section className="p-4">
            <div className="flex flex-row items-center justify-center gap-2">
              <p className="text-sm text-muted-foreground">Already have an account?</p>
              <button
                onClick={() => {
                  closeModal()
                  openModal()
                }}
                className="cursor-pointer text-sm hover:underline"
              >
                Sign In
              </button>
            </div>
          </section>
        </div>
      )}
      {step === Steps.VERIFY && userId && <Verification userId={userId} setStep={setStep} />}
    </Modal>
  )
}

type VerificationProps = {
  userId: number
  setStep: (step: Steps) => void
}

type CustomErrorVerify = {
  response: {
    data: {
      error: {
        code: string
      }
    }
  }
} & AxiosError

function Verification({ userId, setStep }: VerificationProps) {
  const { closeModal } = useRegisterUserModalContext()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerifyUserForm>({
    resolver: zodResolver(verifyUserValidator),
  })

  const { mutate: verifyUser, isPending } = useMutation({
    mutationFn: (data: VerifyUserForm) => API.post(`/v1/auth/verify/${userId}`, { code: data.code }),
    onSuccess: () => {
      setStep(Steps.REGISTER)
      closeModal()
      reset()

      toast.success("Account verified, please sign in")
    },
    onError: (error: CustomErrorVerify) => {
      if (error.response.data.error.code) {
        toast.error(capitalize(error.response.data.error.code))
        return
      }

      toast.error("Something went wrong, please try again later")
    },
  })

  function onSubmitVerification(data: VerifyUserForm) {
    verifyUser({
      code: data.code,
    })
  }

  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-scroll sm:h-auto sm:overflow-y-auto">
      <section className="px-4 pt-4">
        <h2 className="text-2xl font-bold">Verify your email</h2>
        <h3 className="mt-2 font-light text-muted-foreground">Please check your email to verify your account</h3>
      </section>
      <div className="w-full border-b border-border">
        <section className="p-4">
          <form
            onSubmit={(e) => void handleSubmit(onSubmitVerification)(e)}
            className="space-y-2"
            aria-labelledby="registerFormHeading"
          >
            <div className="grid gap-1.5">
              <label htmlFor="name">Verification code</label>
              <Input {...register("code")} autoFocus type="text" id="name" placeholder="asd-3bd" />
              {errors?.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            </div>
            <div className="pt-4">
              <Button disabled={isPending} isLoading={isPending} type="submit" className="w-full">
                Verify
              </Button>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
