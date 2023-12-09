import "~/styles/globals.css"

import type { AppProps } from "next/app"
import { Nunito } from "next/font/google"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

import { LoginUserModal } from "~/components/models/login-user-modal"
import { RegisterUserModal } from "~/components/models/register-user-modal"
import { TailwindIndicator } from "~/components/tailwind-indicator"

const font = Nunito({ subsets: ["latin"] })

export default function App({ Component, pageProps }: AppProps) {
  const queryClient = new QueryClient()

  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${font.style.fontFamily};
        }
      `}</style>
      <QueryClientProvider client={queryClient}>
        <RegisterUserModal />
        <Toaster richColors={true} />
        <LoginUserModal />
        <Component {...pageProps} />
        <TailwindIndicator />
      </QueryClientProvider>
    </>
  )
}
