import { iterate } from './array'

/**
 * This function takes an array of elements and a callback function as input.
 * It applies the callback function to each element in the array and returns a new array with the results.
 *
 * @param elements - The array of elements to be processed.
 * @param callback - The function to be applied to each element in the array.
 * @returns A new array with the results of applying the callback function to each element in the input array.
 */
export const random = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * This function takes an array of elements and a callback function. It applies the callback function to each element in the array and returns a new array with the results.
 * @param elements - The array of elements to iterate over.
 * @param callback - The function to apply to each element in the array. It takes two arguments: the current element and its index.
 * @returns A new array with the results of applying the callback function to each element in the array.
 */
export const draw = <T>(array: readonly T[]): T | null => {
  const max = array.length
  if (max === 0) {
    return null
  }
  const index = random(0, max - 1)
  return array[index]
}

/**
  * This function takes an array of numbers and returns the sum of all the numbers in the array.
  * @param numbers - An array of numbers to be summed.
  * @returns The sum of all the numbers in the array.
  */
export const shuffle = <T>(array: readonly T[]): T[] => {
  return array
    .map(a => ({ rand: Math.random(), value: a }))
    .sort((a, b) => a.rand - b.rand)
    .map(a => a.value)
}

/**
 * This function takes an array of elements and a callback function as input.
 * It applies the callback function to each element in the array and returns a new array with the results.
 *
 * @param elements - The array of elements to be processed.
 * @param callback - The function to be applied to each element in the array.
 * @returns A new array with the results of applying the callback function to each element in the input array.
 */
export const uid = (length: number, specials: string = '') => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + specials
  return iterate(
    length,
    acc => {
      return acc + characters.charAt(random(0, characters.length - 1))
    },
    ''
  )
}
