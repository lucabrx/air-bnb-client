import { useLoginUserModalContext } from "~/hooks/context/login-user-modal-context"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Modal } from "~/components/ui/model"
import { Icons } from "~/components/icons"

export function LoginUserModal() {
  const { isOpen, closeModal } = useLoginUserModalContext()
  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      styles="lg:min-w-[40rem]"
      title="Sign In"
      aria-label="Sign In User Modal"
    >
      <section className="px-4 pt-4">
        <h2 className="text-2xl font-bold">Welcome back!</h2>
        <h3 className="mt-2 font-light text-muted-foreground">Sign in to your account to continue</h3>
      </section>
      <div className="w-full border-b border-border">
        <section className="p-4">
          <form className="space-y-2" aria-labelledby="signInFormHeading">
            <div className="grid gap-1.5">
              <label htmlFor="email">Email</label>
              <Input type="text" id="email" placeholder="malkovich@example.com" />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="password">Password</label>
              <Input type="password" id="password" placeholder="*************" />
            </div>
            <div className="pt-4">
              <Button type="submit" className="w-full">
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
    </Modal>
  )
}
