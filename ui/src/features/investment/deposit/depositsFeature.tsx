import { Separator } from "@radix-ui/react-separator";
import { FixedDepositFeature } from "./fixedDepositFeature";
import { RecurringDespositFeature } from "./recurringDespositFeature";

export default function DepositsFeature() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <FixedDepositFeature />
      <Separator decorative className="bg-accent" />
      {/* <RecurringDespositFeature /> */}
    </div>
  )
}