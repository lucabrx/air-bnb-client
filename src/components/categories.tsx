import { useEffect, useState } from "react"
import { useRouter } from "next/router"

import { categories } from "~/config/categories"
import { cn } from "~/lib/utils"

export function Categories() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  function handleSearch(category: string) {
    if (category === selectedCategory) {
      setSelectedCategory("")
      return void router.push({
        pathname: "/",
        query: {},
      })
    }
    void router.push({
      pathname: "/",
      query: { ...router.query, search: category },
    })
  }

  useEffect(() => {
    for (const category of categories) {
      if (category.label === router.query.search) {
        setSelectedCategory(category.label)
      }
      if (router.query.search == null) {
        setSelectedCategory("")
      }
    }
  }, [router])

  return (
    <div className=" mt-16 flex w-full items-center justify-center py-3 ">
      <div className="container flex w-full items-center justify-between overflow-x-auto">
        {categories.map((category) => {
          const Icon = category.icon
          return (
            <button
              onClick={() => handleSearch(category.label)}
              key={category.label}
              className={cn(
                "flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 p-3 text-muted-foreground transition-colors hover:border-b-2 hover:text-foreground group-hover:border-b-2 group-hover:text-foreground",
                selectedCategory === category.label && "border-b-2 border-foreground text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "group h-6 w-6 text-muted-foreground hover:text-foreground group-hover:text-foreground",
                  selectedCategory === category.label && "text-foreground"
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
