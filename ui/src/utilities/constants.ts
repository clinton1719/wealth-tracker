export const defaultProfile = {
  profileName: '',
  profileColorCode: '#000000',
  profileDescription: '',
  profilePicture: undefined,
}

export const defaultCategory = {
  categoryName: '',
  categoryDescription: '',
  categoryColorCode: '#000000',
  categoryIcon: '',
  categoryTags: [],
}

export const defaultLogin = {
  username: '',
  password: '',
}

export const defaultSignUp = {
  username: '',
  password: '',
  confirmPassword: '',
}

export const defaultAccount = {
  accountName: '',
  accountBalance: 0,
  accountDescription: '',
  accountType: '',
  profileName: '',
}

export const defaultExpense = {
  expenseAmount: 0,
  expenseDescription: '',
  expenseCreatedAt: '',
  expenseUpdatedAt: '',
  categoryName: '',
  accountName: '',
  profileName: '',
}

export const defaultFixedDeposit = {
  fixedDepositName: '',
  fixedDepositPrincipal: 0,
  fixedDepositInterestRate: 0,
  fixedDepositYears: '',
  fixedDepositMonths: '',
  fixedDepositDays: '',
  accountName: '',
  profileName: '',
  fixedDepositStartDate: new Date(),
}

interface YearGroup {
  groupLabel: string
  years: string[]
}
interface DayGroup {
  groupLabel: string
  days: string[]
}
const fixedDepositNoOfYears = 30
const FD_YEAR_GROUP_SIZE = 10
export const FIXED_DEPOSIT_YEAR_GROUPS: YearGroup[] = Array.from(
  { length: Math.ceil(fixedDepositNoOfYears / FD_YEAR_GROUP_SIZE) },
  (_, index) => {
    const start = index * FD_YEAR_GROUP_SIZE + 1
    const end = Math.min((index + 1) * FD_YEAR_GROUP_SIZE, fixedDepositNoOfYears)

    return {
      groupLabel: `Years ${start} - ${end}`,
      years: Array.from({ length: end - start + 1 }, (__, i) => (start + i).toString()),
    }
  },
)

const fixedDepositNoOfMonths = 11
export const FIXED_DEPOSIT_MONTHS: string[] = Array.from(
  { length: fixedDepositNoOfMonths },
  (_, i) => (i + 1).toString(),
)

const fixedDepositNoOfDays = 31
const FD_DAY_GROUP_SIZE = 11
export const FIXED_DEPOSIT_DAY_GROUPS: DayGroup[] = Array.from(
  { length: Math.ceil(fixedDepositNoOfDays / FD_DAY_GROUP_SIZE) },
  (_, index) => {
    const start = index * FD_DAY_GROUP_SIZE + 1
    const end = Math.min((index + 1) * FD_DAY_GROUP_SIZE, fixedDepositNoOfDays)

    return {
      groupLabel: `Days ${start} - ${end}`,
      days: Array.from({ length: end - start + 1 }, (__, i) => (start + i).toString()),
    }
  },
)

export const ALL_TAG_TYPES = [
  'Accounts',
  'Expenses',
  'Categories',
  'Auth',
  'Profiles',
  'FixedDeposits',
] as const
