export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
  return formatted
}

export function formatMonth(yearMonth: string) {
  const [year, month] = yearMonth.split('-').map(Number)
  return new Date(year, month - 1).toLocaleString('en-US', {
    month: 'short',
    year: 'numeric',
  })
}
