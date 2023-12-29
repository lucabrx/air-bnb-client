import { useEffect, useState, type HTMLAttributes } from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { type DateRange, type Matcher } from "react-day-picker"

import { Calendar } from "~/pages/listings/calendar"

import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"

type DateRangePickerProps = {
  className?: string
  startDate: Date | null
  endDate: Date | null
  setStartDate: (date: Date | null) => void
  setEndDate: (date: Date | null) => void
  disabledDates?: Matcher[]
} & HTMLAttributes<HTMLDivElement>
export function DateRangePicker({
  className,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  disabledDates,
}: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: startDate ?? new Date(),
    to: endDate ?? addDays(new Date(), 7),
  })

  useEffect(() => {
    setDate({
      from: startDate ?? new Date(),
      to: endDate ?? addDays(new Date(), 7),
    })
  }, [startDate, endDate])

  const handleDateSelect = (range: DateRange | undefined) => {
    if (range) {
      setStartDate(range.from ?? null)
      setEndDate(range.to ?? null)
    } else {
      setStartDate(null)
      setEndDate(null)
    }
  }

  return (
    <div className={cn("grid w-full gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            disabled={disabledDates}
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={{ from: startDate!, to: endDate! }}
            onSelect={handleDateSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
