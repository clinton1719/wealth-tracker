import { useState } from "react"
import { ExpensePeriodSelector } from "./expense-statistics-components/expensePeriodSelector"

export function ExpenseStatistics() {
  const [period, setPeriod] = useState<{
    from: Date
    to: Date
  } | null>(null)

  const handleGenerate = (from: Date, to: Date) => {
    setPeriod({ from, to })
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <ExpensePeriodSelector onGenerate={handleGenerate} />

      {period && (
        <div className="text-muted-foreground">
          PDF generated for expenses from{" "}
          <span className="font-medium">{period.from.toDateString()}</span> to{" "}
          <span className="font-medium">{period.to.toDateString()}</span>
        </div>
      )}
    </div>
  )
}
