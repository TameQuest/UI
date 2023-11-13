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
