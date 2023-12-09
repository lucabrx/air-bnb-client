import "~/styles/globals.css"

import type { AppProps } from "next/app"
import { Nunito } from "next/font/google"

import { TailwindIndicator } from "~/components/tailwind-indicator"

const font = Nunito({ subsets: ["latin"] })

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${font.style.fontFamily};
        }
      `}</style>
      <Component {...pageProps} />
      <TailwindIndicator />
    </>
  )
}
