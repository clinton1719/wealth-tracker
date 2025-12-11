export const formatDate = (date: Date) => date.toISOString().split('T')[0]

export function base64ToFile(
  base64: string,
  filename: string,
  type: string,
): File {
  const byteCharacters = atob(base64)
  const byteNumbers = Array.from(byteCharacters, c => c.charCodeAt(0))
  const byteArray = new Uint8Array(byteNumbers)

  return new File([byteArray], filename, { type })
}

export function formatCurrency(amount: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount)
  return formatted
}
