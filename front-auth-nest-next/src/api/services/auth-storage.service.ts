export function setValuesToLS(key: string, value: string): void {
  localStorage.setItem(key, value)
}

export function getValuesFromLS(key: string): string | null {
  return localStorage.getItem(key)
}

export function removeValuesFromLS(key: string): void {
  localStorage.removeItem(key)
}
