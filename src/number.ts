/**
 * This function takes an array of numbers and returns the sum of all the numbers in the array.
 * @param numbers - An array of numbers to be summed.
 * @returns The sum of all the numbers in the array.
 */
export function inRange(number: number, end: number): boolean

/**
  * This function takes an array of numbers and returns the sum of all the numbers in the array.
  * @param numbers - An array of numbers to be summed.
  * @returns The sum of all the numbers in the array.
  */
export function inRange(number: number, start: number, end: number): boolean
/**
 * This function calculates the sum of two numbers.
 * @param a The first number to be added.
 * @param b The second number to be added.
 * @returns The sum of the two numbers.
 */
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

/**
  * This function takes an array of elements and a callback function. It applies the callback function to each element in the array and returns a new array with the results.
  * @param array - The array of elements to be processed.
  * @param callback - The function to be applied to each element in the array. It should take one argument, the current element being processed, and return a value to be included in the new array.
  * @returns A new array with the results of applying the callback function to each element in the input array.
  */
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

/**
 * This function takes an array of elements and a callback function. It applies the callback function to each element in the array and returns a new array with the results.
 * @param array - The array of elements to iterate over.
 * @param callback - The function to apply to each element in the array. It takes two arguments: the current element and its index.
 * @returns A new array with the results of applying the callback function to each element in the array.
 */
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
