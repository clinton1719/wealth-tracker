import { CalendarComponent } from "@/components/building-blocks/calendar"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ExpensePeriodSelector({
  onGenerate,
}: {
  onGenerate: (from: Date, to: Date) => void
}) {
  const [from, setFrom] = useState<Date | undefined>()
  const [to, setTo] = useState<Date | undefined>()

  const isNotValid = Boolean(from && to && from >= to)
  const isValid = Boolean(from && to && from <= to)

  return (
    <section className="rounded-xl border p-4 space-y-4">
      <h2 className="text-lg font-semibold">Select expense period</h2>

      <div className="flex flex-wrap gap-4 items-end">
        <CalendarComponent date={from} setDate={setFrom} label="From" />
        <CalendarComponent date={to} setDate={setTo} label="To" />

        <Button
          disabled={!isValid}
          onClick={() => onGenerate(from!, to!)}
        >
          Generate
        </Button>
      </div>
      {isNotValid && 
      <p className="text-sm font-medium text-destructive mt-1">
        End date cannot be before or equal to start date
      </p>}
    </section>
  )
}
