import { Button } from '@/components/ui/button'

export function ExpenseReportGenerator({
  generatePDF,
}: {
  generatePDF: () => void
}) {
  return (
    <section className="rounded-xl border p-4 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Generate report PDF for the above period including expense transactions</h2>
      <div className="flex flex-wrap gap-4 items-end">
        <div className="flex gap-2">
          <Button
            variant="default"
            onClick={() => generatePDF()}
          >
            Generate PDF
          </Button>
        </div>
      </div>
    </section>
  )
}
