import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import { categories } from "~/config/categories"
import { API, cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Layout } from "~/components/layouts/layout"

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  return (
    <>
      <Categories selected={selectedCategory} setSelected={setSelectedCategory} />
      <Layout className="mt-0">
        <Button>Hello World</Button>
      </Layout>
    </>
  )
}

type CategoriesProps = {
  selected: string
  setSelected: (selected: string) => void
}
export function Categories({ selected, setSelected }: CategoriesProps) {
  useEffect(() => {
    API.get("/v1/listings/1")
      .then((res) => {
        console.log(res.data)
      })
      .catch(console.error)
  }, [])

  return (
    <div className=" mt-16 flex w-full items-center justify-center py-3 ">
      <div className="flex w-full items-center justify-between overflow-x-auto">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              onClick={() => setSelected(category.label)}
              key={category.label}
              className={cn(
                "flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 p-3 text-muted-foreground transition-colors hover:border-b-2 hover:text-foreground group-hover:border-b-2 group-hover:text-foreground",
                selected === category.label && "border-b-2 border-foreground text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "group h-6 w-6 text-muted-foreground hover:text-foreground group-hover:text-foreground",
                  selected === category.label && "text-foreground"
                )}
              />
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
