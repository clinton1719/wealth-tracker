export interface FixedDeposit {
  fixedDepositId: number
  fixedDepositName: string
  fixedDepositPrincipal: number
  fixedDepositInterestRate: number
  fixedDepositTenure: string
  fixedDepositStartDate: Date
  fixedDepositMaturityDate: Date
  fixedDepositMaturityAmount: number
  fixedDepositInterestEarned: number
  accountId: number
  profileId: number
}
