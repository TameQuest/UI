export function classNames(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ')
}

export function weakHash(str: string) {
  if (str.length === 0) {
    return 0
  }
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = h * 31 + str.charCodeAt(i)
    h = h % 2 ** 32
  }
  return h
}

export const getGoddessName = (id: number): string => {
  const names = ['Electra', 'Lumina', 'Sonus', 'Chronis']
  return names[id]
}

export const formatAmount = (
  value: number,
  decimals = 6,
  precision = 2,
  includeExponential = false
): string => {
  const amount = value / Math.pow(10, decimals)
  if (!amount || amount === 0) return '0'
  if (amount > 100)
    return Math.round(amount)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  if (amount > 1) return amount.toFixed(precision)
  if (amount < 0.00001)
    return includeExponential ? amount.toPrecision(precision) : '<0.00001'
  if (amount < 0.0001) return amount.toPrecision(1)
  if (amount < 0.001) return amount.toPrecision(2)
  if (amount < 0.01) return amount.toPrecision(3)
  if (amount < 1)
    return precision === 0
      ? amount.toFixed(precision)
      : amount.toPrecision(precision)
  return amount.toFixed(precision)
}

export const getCreatureImage = (tier: number, id: number) => {
  return `/creatures/T${tier + 1}/${id}.png`
}

export const getBackgroundImage = (id: number) => {
  return `/backgrounds/${id}.png`
}
