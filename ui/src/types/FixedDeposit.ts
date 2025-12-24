export interface FixedDeposit {
    fixedDepositId: number;
    fixedDepositName: string;
    fixedDepositPrincipal: number;
    fixedDepositInterestRate: number;
    fixedDepositTenure: string;
    accountId: number;
    profileId: number;
    fixedDepositStartDate: Date;
}