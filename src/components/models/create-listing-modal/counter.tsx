import { Button } from "~/components/ui/button"
import { Icons } from "~/components/icons"

type CounterProps = {
  title: string
  subtitle: string
  val: number
  onChange: (val: number) => void
}

export function Counter({ title, subtitle, val, onChange }: CounterProps) {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <article className="flex flex-col">
        <h2 className="font-medium">{title}</h2>
        <div className="font-light text-gray-600">{subtitle}</div>
      </article>
      <article className="flex flex-row items-center gap-4">
        <Button
          type="button"
          onClick={() => {
            if (val === 1) return
            onChange(val - 1)
          }}
          variant="outline"
          size="icon"
          className=" rounded-full transition hover:opacity-80"
        >
          <Icons.Minus className="h-4 w-4" />
        </Button>
        <span className="text-xl font-light text-muted-foreground">{val}</span>
        <Button
          type="button"
          onClick={() => onChange(val + 1)}
          variant="outline"
          size="icon"
          className=" rounded-full transition hover:opacity-80"
        >
          <Icons.Plus className="h-4 w-4" />
        </Button>
      </article>
    </div>
  )
}
