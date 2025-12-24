import type { FixedDeposit } from "./FixedDeposit";
import type { Profile } from "./Profile";

export interface FixedDepositSectionProps {
  fixedDeposit: FixedDeposit;
  profile: Profile;
  handleDeleteFixedDeposit: (fixedDeposit: FixedDeposit) => void
}