import { CalendarComponent } from "@/components/building-blocks/calendar";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ExpensePeriodSelector({
  onGenerate,
}: {
  onGenerate: (from: Date, to: Date) => void
}) {
  const [from, setFrom] = useState<Date | undefined>();
  const [to, setTo] = useState<Date | undefined>();

  const isInvalid = from && to && from > to;
  const canGenerate = from && to && !isInvalid;

  const setPreset = (type: 'thisMonth' | 'lastMonth') => {
    const now = new Date();
    let start: Date;
    let end: Date;

    if (type === 'thisMonth') {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      end = new Date();
    } else {
      start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      end = new Date(now.getFullYear(), now.getMonth(), 0);
    }
    
    setFrom(start);
    setTo(end);
    onGenerate(start, end);
  };

  return (
    <section className="rounded-xl border p-4 space-y-4 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Select expense period</h2>

      <div className="flex flex-wrap gap-4 items-end">
        <CalendarComponent date={from} setDate={setFrom} label="From" />
        <CalendarComponent date={to} setDate={setTo} label="To" />

        <div className="flex gap-2">
          <Button
            variant="default"
            disabled={!canGenerate}
            onClick={() => onGenerate(from!, to!)}
          >
            Generate Report
          </Button>
          
          <Button variant="outline" onClick={() => setPreset('thisMonth')}>
            This Month
          </Button>
          
          <Button variant="outline" onClick={() => setPreset('lastMonth')}>
            Last Month
          </Button>
        </div>
      </div>

      {isInvalid && (
        <p className="text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1">
          End date cannot be earlier than start date.
        </p>
      )}
    </section>
  );
}