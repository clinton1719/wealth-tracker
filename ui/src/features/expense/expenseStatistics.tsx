import { Button } from "@/components/ui/button";

export function ExpenseStatistics() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <div className="flex gap-2">
        <p>Generate PDF</p>
        <Button>Generate</Button>
      </div>
    </div>
  )
}
