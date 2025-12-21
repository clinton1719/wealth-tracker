import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { useState } from 'react';

export function ExpenseReportGenerator({
    generatePDF,
}: {
    generatePDF: (isChecked: boolean | string) => void
}) {
    const [isChecked, setIsChecked] = useState<boolean | "indeterminate">(false);
    return (
        <section className="rounded-xl border p-4 space-y-4 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Generate report PDF for the above period</h2>
            <div className="flex items-center gap-3">
                <Checkbox id="includeExpenseTransactions" checked={isChecked}
                    onCheckedChange={setIsChecked} />
                <Label htmlFor="includeExpenseTransactions">Include all expense transactions in this report</Label>
            </div>
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex gap-2">
                    <Button
                        variant="default"
                        onClick={() => generatePDF(isChecked)}
                    >
                        Generate PDF
                    </Button>
                </div>
            </div>
        </section>
    )
}
