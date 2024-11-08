export function inRange(number: number, end: number): boolean

export function inRange(number: number, start: number, end: number): boolean
export function inRange(number: number, start: number, end?: number): boolean {
  const isTypeSafe =
    typeof number === 'number' &&
    typeof start === 'number' &&
    (typeof end === 'undefined' || typeof end === 'number')

  if (!isTypeSafe) {
    return false
  }

  if (typeof end === 'undefined') {
    end = start
    start = 0
  }

  return number >= Math.min(start, end) && number < Math.max(start, end)
}

export const toFloat = <T extends number | null = number>(
  value: any,
  defaultValue?: T
): number | T => {
  const def = defaultValue === undefined ? 0.0 : defaultValue
  if (value === null || value === undefined) {
    return def
  }
  const result = parseFloat(value)
  return isNaN(result) ? def : result
}

export const toInt = <T extends number | null = number>(
  value: any,
  defaultValue?: T
): number | T => {
  const def = defaultValue === undefined ? 0 : defaultValue
  if (value === null || value === undefined) {
    return def
  }
  const result = parseInt(value)
  return isNaN(result) ? def : result
}
