export const expenseNavigationStaticValues: {
  title: string
  to: string
  description: string
}[] = [
  {
    title: 'Add expense',
    to: '/expense',
    description:
      'Add a new expense to keep track of your spending habits.',
  },
  {
    title: 'View and generate expense reports',
    to: '/expense/statistics',
    description: 'View complete detailed report of your expenses',
  },
  {
    title: 'Manage categories',
    to: '/category',
    description: 'View and manage your categories.',
  },
]

export const investmentNavigationStaticValues: {
  title: string
  to: string
  description: string
}[] = [
  {
    title: 'Add fixed/recurring deposits',
    to: '/investment',
    description:
      'Add a new Fixed deposit(FD) or Recurring deposit(RD)',
  },
]