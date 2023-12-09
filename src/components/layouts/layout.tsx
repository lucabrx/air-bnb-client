import { type ReactNode } from "react"
import Head from "next/head"

import { cn } from "~/lib/utils"
import { Header } from "~/components/layouts/header"

type LayoutProps = {
  title?: string
  children?: ReactNode
  className?: string
}

export function Layout({ title, children, className }: LayoutProps) {
  return (
    <>
      <Head>
        <title>{title ? "Air BnB - " + title : "Air BnB"}</title>
      </Head>
      <Header />
      <main className={cn("container flex-1", className)}>{children}</main>
    </>
  )
}
