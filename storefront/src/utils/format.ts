const currency = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
})

export const formatPrice = (usd: number) => currency.format(usd * 26000)

export const digitsOnly = (value: string) => value.replace(/\D/g, '')

export const formatCardNumber = (value: string) =>
  digitsOnly(value)
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')

export const formatExpiry = (value: string) => {
  const digits = digitsOnly(value).slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export const isValidExpiry = (value: string) => {
  if (!/^\d{2}\/\d{2}$/.test(value)) return false
  const [monthText, yearText] = value.split('/')
  const month = Number(monthText)
  const year = Number(yearText)
  if (month < 1 || month > 12) return false

  const now = new Date()
  const currentYear = now.getFullYear() % 100
  const currentMonth = now.getMonth() + 1

  return year > currentYear || (year === currentYear && month >= currentMonth)
}
