import { isArray, isFunction } from './typed'

/**
 * Groups an array of items based on a specified group identifier.
 *
 * @typeParam T - The type of the items in the input array.
 * @typeParam Key - The type of the group identifier, which can be a string, number, or symbol.
 *
 * @param array - The input array of items to be grouped.
 * @param getGroupId - A function that takes an item and returns its group identifier.
 *
 * @returns A partial record where the keys are the group identifiers and the values are arrays of items that belong to that group.
 */
export const group = <T, Key extends string | number | symbol>(
  array: readonly T[],
  getGroupId: (item: T) => Key
): Partial<Record<Key, T[]>> => {
  return array.reduce((acc, item) => {
    const groupId = getGroupId(item)
    if (!acc[groupId]) acc[groupId] = []
    acc[groupId].push(item)
    return acc
  }, {} as Record<Key, T[]>)
}

/**
   * Zips five input arrays into an array of 5-tuples. Each tuple contains elements from the corresponding index of the input arrays.
   *
   * @param array1 The first input array.
   * @param array2 The second input array.
   * @param array3 The third input array.
   * @param array4 The fourth input array.
   * @param array5 The fifth input array.
   * @returns An array of 5-tuples, where each tuple contains elements from the corresponding index of the input arrays.
   */
export function zip<T1, T2, T3, T4, T5>(
  array1: T1[],
  array2: T2[],
  array3: T3[],
  array4: T4[],
  array5: T5[]
): [T1, T2, T3, T4, T5][]
/**
 * Zips four input arrays into an array of tuples, where each tuple contains an element from each input array.
 *
 * @param array1 - The first input array.
 * @param array2 - The second input array.
 * @param array3 - The third input array.
 * @param array4 - The fourth input array.
 * @returns An array of tuples, where each tuple contains an element from each input array.
 *
 * @example
 * ```
 * const array1 = [1, 2, 3];
 * const array2 = ['a', 'b', 'c'];
 * const array3 = [true, false, true];
 * const array4 = [{}, {}, {}];
 *
 * const result = zip(array1, array2, array3, array4);
 * // result: [ [1, 'a', true, {}], [2, 'b', false, {}], [3, 'c', true, {}] ]
 * ```
 */
export function zip<T1, T2, T3, T4>(
  array1: T1[],
  array2: T2[],
  array3: T3[],
  array4: T4[]
): [T1, T2, T3, T4][]
/**
 * Zips three arrays into an array of tuples, where the i-th tuple contains the i-th element from each of the three input arrays.
 *
 * @param array1 An array of elements of type T1.
 * @param array2 An array of elements of type T2.
 * @param array3 An array of elements of type T3.
 * @returns An array of tuples, where each tuple contains an element from each of the input arrays.
 */
export function zip<T1, T2, T3>(
  array1: T1[],
  array2: T2[],
  array3: T3[]
): [T1, T2, T3][]
/**
 * Zips two arrays into an array of pairs.
 *
 * @param array1 The first array.
 * @param array2 The second array.
 * @returns An array of pairs, where the i-th pair contains the i-th element from each input array.
 *
 * @example
 * ```
 * const array1 = [1, 2, 3];
 * const array2 = ['a', 'b', 'c'];
 * const result = zip(array1, array2); // [[1, 'a'], [2, 'b'], [3, 'c']]
 * ```
 */
export function zip<T1, T2>(array1: T1[], array2: T2[]): [T1, T2][]
/**
 * Zips multiple arrays together by creating a 2D array where the i-th subarray contains the i-th element from each of the input arrays.
 * If an input array is shorter than the others, its remaining elements are treated as `undefined`.
 *
 * @param arrays - The arrays to zip together.
 * @returns A 2D array where the i-th subarray contains the i-th element from each of the input arrays.
 *
 * @example
 * ```
 * const result = zip([1, 2, 3], ['a', 'b', 'c']);
 * console.log(result); // [[1, 'a'], [2, 'b'], [3, 'c']]
 * ```
 */
export function zip<T>(...arrays: T[][]): T[][] {
  if (!arrays || !arrays.length) return []
  return new Array(Math.max(...arrays.map(({ length }) => length)))
    .fill([])
    .map((_, idx) => arrays.map(array => array[idx]))
}

/**
 * Zips an array of keys with an array of values or a single value (or a function that returns a value) to create an object.
 *
 * @template K The type of the keys, which can be a string, number, or symbol.
 * @template V The type of the values.
 *
 * @param {K[]} keys - An array of keys to use for the object.
 * @param {V | ((key: K, idx: number) => V) | V[]} values - An array of values, a single value, or a function that returns a value.
 * If an array, it must have the same length as the keys array. If a function, it will be called with each key and its index.
 *
 * @returns {Record<K, V>} An object with the keys and values zipped together.
 * If the keys array is empty, an empty object will be returned.
 */
export function zipToObject<K extends string | number | symbol, V>(
  keys: K[],
  values: V | ((key: K, idx: number) => V) | V[]
): Record<K, V> {
  if (!keys || !keys.length) {
    return {} as Record<K, V>
  }

  const getValue = isFunction(values)
    ? values
    : isArray(values)
    ? (_k: K, i: number) => values[i]
    : (_k: K, _i: number) => values

  return keys.reduce((acc, key, idx) => {
    acc[key] = getValue(key, idx)
    return acc
  }, {} as Record<K, V>)
}

/**
 * Boils down an array to a single value using a comparison function.
 * @param array The array to boil down.
 * @param compareFunc The function to compare elements in the array.
 * @returns The boiled down value, or null if the array is empty or undefined.
 */
export const boil = <T>(
  array: readonly T[],
  compareFunc: (a: T, b: T) => T
) => {
  if (!array || (array.length ?? 0) === 0) return null
  return array.reduce(compareFunc)
}

/**
 * Calculates the sum of an array of numbers.
 * @param array An array of numbers.
 * @returns The sum of the numbers in the array.
 * @template T The type of the numbers in the array, which must extend the number type.
 */
export function sum<T extends number>(array: readonly T[]): number
/**
 * Calculates the sum of the values returned by the provided function for each item in the input array.
 * @param array An array of objects to calculate the sum for.
 * @param fn A function that takes an object from the array and returns a number.
 * @returns The sum of the numbers returned by the function for each item in the array.
 */
export function sum<T extends object>(
  array: readonly T[],
  fn: (item: T) => number
): number
/**
 * Sums up the elements in the given array. If a function is provided, it will be used to map each element to a number before summing.
 * @param array The array to sum.
 * @param fn An optional function to map each element to a number before summing.
 * @returns The sum of the elements in the array.
 * @template T The type of the elements in the array. Must extend object or number.
 */
export function sum<T extends object | number>(
  array: readonly any[],
  fn?: (item: T) => number
): number {
  return (array || []).reduce((acc, item) => acc + (fn ? fn(item) : item), 0)
}

/**
 * Returns the first element of an array, or a default value if the array is empty.
 * @param array The array to get the first element from.
 * @param defaultValue The value to return if the array is empty. Default is `undefined`.
 * @returns The first element of the array, or the default value if the array is empty.
 */
export const first = <T>(
  array: readonly T[],
  defaultValue: T | null | undefined = undefined
) => {
  return array?.length > 0 ? array[0] : defaultValue
}

/**
 * Returns the last element of the given array, or the provided default value if the array is empty.
 * @param array The array to get the last element from.
 * @param defaultValue The value to return if the array is empty. Defaults to `undefined`.
 * @returns The last element of the array, or the provided default value if the array is empty.
 */
export const last = <T>(
  array: readonly T[],
  defaultValue: T | null | undefined = undefined
) => {
  return array?.length > 0 ? array[array.length - 1] : defaultValue
}

/**
 * Sorts an array of elements based on a specified getter function.
 * @param array The array to be sorted.
 * @param getter A function that takes an element from the array and returns a number.
 * @param desc Optional parameter to sort in descending order. Default is false.
 * @returns A new array that is a sorted version of the input array.
 */
export const sort = <T>(
  array: readonly T[],
  getter: (item: T) => number,
  desc = false
) => {
  if (!array) return []
  const asc = (a: T, b: T) => getter(a) - getter(b)
  const dsc = (a: T, b: T) => getter(b) - getter(a)
  return array.slice().sort(desc === true ? dsc : asc)
}

/**
 * Sorts an array of items based on a specified getter function and direction.
 * @param array The array of items to be sorted.
 * @param getter A function that takes an item and returns a string to be used for sorting.
 * @param dir The direction of the sort. Can be either 'asc' for ascending or 'desc' for descending. Default is 'asc'.
 * @returns A new array that is a sorted copy of the input array.
 */
export const alphabetical = <T>(
  array: readonly T[],
  getter: (item: T) => string,
  dir: 'asc' | 'desc' = 'asc'
) => {
  if (!array) return []
  const asc = (a: T, b: T) => `${getter(a)}`.localeCompare(getter(b))
  const dsc = (a: T, b: T) => `${getter(b)}`.localeCompare(getter(a))
  return array.slice().sort(dir === 'desc' ? dsc : asc)
}

/**
 * Counts the occurrences of each unique item in a list based on a provided identity function.
 * @param list The list of items to count.
 * @param identity A function that returns a unique identifier for each item in the list.
 * @returns An object where the keys are the unique identifiers and the values are the counts of each identifier.
 */
export const counting = <T, TId extends string | number | symbol>(
  list: readonly T[],
  identity: (item: T) => TId
): Record<TId, number> => {
  if (!list) return {} as Record<TId, number>
  return list.reduce((acc, item) => {
    const id = identity(item)
    acc[id] = (acc[id] ?? 0) + 1
    return acc
  }, {} as Record<TId, number>)
}

/**
 * Replaces an item in a given list with a new item based on a matching condition.
 * @param list The list to search and replace in.
 * @param newItem The new item to replace the matching item with.
 * @param match A function that takes an item and its index and returns a boolean indicating whether the item matches the condition.
 * @returns A new list with the matching item replaced by the new item. If no match is found, the original list is returned.
 */
export const replace = <T>(
  list: readonly T[],
  newItem: T,
  match: (item: T, idx: number) => boolean
): T[] => {
  if (!list) return []
  if (newItem === undefined) return [...list]
  for (let idx = 0; idx < list.length; idx++) {
    const item = list[idx]
    if (match(item, idx)) {
      return [
        ...list.slice(0, idx),
        newItem,
        ...list.slice(idx + 1, list.length)
      ]
    }
  }
  return [...list]
}

/**
 * Converts an array into an object where the keys are derived from the array items using a provided function.
 *
 * @typeParam T - The type of the items in the input array.
 * @typeParam Key - The type of the keys in the output object. Must be a string, number, or symbol.
 * @typeParam Value - The type of the values in the output object. Defaults to the type of the items in the input array.
 * @param array - The input array to be converted into an object.
 * @param getKey - A function that takes an item from the input array and returns a key for the output object.
 * @param getValue - A function that takes an item from the input array and returns a value for the output object. Defaults to a function that returns the item itself.
 * @returns An object where the keys are derived from the input array items using the provided `getKey` function, and the values are derived from the input array items using the provided `getValue` function.
 */
export const objectify = <T, Key extends string | number | symbol, Value = T>(
  array: readonly T[],
  getKey: (item: T) => Key,
  getValue: (item: T) => Value = item => item as unknown as Value
): Record<Key, Value> => {
  return array.reduce((acc, item) => {
    acc[getKey(item)] = getValue(item)
    return acc
  }, {} as Record<Key, Value>)
}

/**
 * Selects elements from an array based on a condition and maps them to a new value.
 * @param array The array to select elements from.
 * @param mapper A function that maps the selected elements to a new value.
 * @param condition A function that determines whether an element should be selected.
 * @returns An array of the mapped elements that satisfy the condition.
 */
export const select = <T, K>(
  array: readonly T[],
  mapper: (item: T, index: number) => K,
  condition: (item: T, index: number) => boolean
) => {
  if (!array) return []
  return array.reduce((acc, item, index) => {
    if (!condition(item, index)) return acc
    acc.push(mapper(item, index))
    return acc
  }, [] as K[])
}

/**
 * Returns the maximum value from the given array of numbers.
 * @param array An array of numbers.
 * @returns The maximum number in the array.
 */
export function max(array: readonly [number, ...number[]]): number
/**
 * Returns the maximum value in the given array of numbers, or null if the array is empty.
 * @param array An array of numbers.
 * @returns The maximum value in the array, or null if the array is empty.
 */
export function max(array: readonly number[]): number | null
/**
 * Returns the item from the given array that has the maximum value as determined by the provided getter function.
 * If the array is empty, it returns null.
 *
 * @typeparam T - The type of the items in the array.
 * @param array - The array of items to search.
 * @param getter - A function that takes an item and returns a number, used to determine the maximum value.
 * @returns The item with the maximum value, or null if the array is empty.
 */
export function max<T>(
  array: readonly T[],
  getter: (item: T) => number
): T | null
/**
 * Returns the maximum value in the given array based on the provided getter function.
 * If no getter function is provided, it defaults to comparing the items directly.
 * If the array is empty, it returns null.
 *
 * @param array - The array to find the maximum value in.
 * @param getter - An optional function to extract a numeric value from each item in the array.
 * @returns The maximum value in the array, or null if the array is empty.
 */
export function max<T>(
  array: readonly T[],
  getter?: (item: T) => number
): T | null {
  const get = getter ?? ((v: any) => v)
  return boil(array, (a, b) => (get(a) > get(b) ? a : b))
}

/**
 * Returns the smallest number in the given array.
 * @param array An array of numbers.
 * @returns The smallest number in the array.
 */
export function min(array: readonly [number, ...number[]]): number
/**
 * Returns the minimum value in the given array of numbers, or null if the array is empty.
 * @param array An array of numbers.
 * @returns The minimum value in the array, or null if the array is empty.
 */
export function min(array: readonly number[]): number | null
/**
 * Returns the item from the given array with the minimum value as determined by the provided getter function.
 * If the array is empty, it returns null.
 *
 * @param array - The array to search for the minimum value.
 * @param getter - A function that takes an item from the array and returns a number.
 * @returns The item from the array with the minimum value, or null if the array is empty.
 */
export function min<T>(
  array: readonly T[],
  getter: (item: T) => number
): T | null
/**
 * Returns the minimum value in the given array based on the provided getter function or the value itself if no getter is provided.
 * If the array is empty, it returns null.
 *
 * @param array - The array to search for the minimum value.
 * @param getter - An optional function that takes an item from the array and returns a number.
 *                  If not provided, the value itself is used.
 *
 * @returns The minimum value in the array based on the provided getter function, or null if the array is empty.
 */
export function min<T>(
  array: readonly T[],
  getter?: (item: T) => number
): T | null {
  const get = getter ?? ((v: any) => v)
  return boil(array, (a, b) => (get(a) < get(b) ? a : b))
}

/**
 * Clusters a given list into arrays of a specified size.
 * @param list The list to be clustered.
 * @param size The size of each cluster. Default is 2.
 * @returns An array of clusters.
 */
export const cluster = <T>(list: readonly T[], size: number = 2): T[][] => {
  const clusterCount = Math.ceil(list.length / size)
  return new Array(clusterCount).fill(null).map((_c: null, i: number) => {
    return list.slice(i * size, i * size + size)
  })
}

/**
 * Returns a new array with unique elements from the input array based on a specified key.
 * If no key is provided, it uses the elements themselves as keys.
 *
 * @typeparam T - The type of the elements in the input array.
 * @typeparam K - The type of the key used to determine uniqueness. Must be a string, number, or symbol.
 * @param array - The input array.
 * @param toKey - An optional function that takes an element and returns a key used to determine uniqueness.
 * @returns A new array with unique elements based on the specified key.
 */
export const unique = <T, K extends string | number | symbol>(
  array: readonly T[],
  toKey?: (item: T) => K
): T[] => {
  const valueMap = array.reduce((acc, item) => {
    const key = toKey ? toKey(item) : (item as any as string | number | symbol)
    if (acc[key]) return acc
    acc[key] = item
    return acc
  }, {} as Record<string | number | symbol, T>)
  return Object.values(valueMap)
}

/**
 * range - Generates a sequence of numbers or mapped values within a specified range.
 * @param startOrLength - The start of the range or the length of the range if `end` is not provided.
 * @param end - The end of the range. If not provided, `startOrLength` is used as the end.
 * @param valueOrMapper - The value to be used in the range or a mapping function to transform the range values.
 * @param step - The step value between each number in the range. Default is 1.
 * @returns A generator that yields the sequence of numbers or mapped values.
 * @template T - The type of the range values. Default is `number`.
 */
export function* range<T = number>(
  startOrLength: number,
  end?: number,
  valueOrMapper: T | ((i: number) => T) = i => i as T,
  step: number = 1
): Generator<T> {
  const mapper = isFunction(valueOrMapper) ? valueOrMapper : () => valueOrMapper
  const start = end ? startOrLength : 0
  const final = end ?? startOrLength
  for (let i = start; i <= final; i += step) {
    yield mapper(i)
    if (i + step > final) break
  }
}

/**
 * Generates an array of elements of type T, based on the provided parameters.
 *
 * @param startOrLength - The starting value or the length of the array.
 * @param end - The ending value for the array generation.
 * @param valueOrMapper - The value to fill the array with or a function to map the index to the value.
 * @param step - The step value for the array generation.
 * @returns An array of elements of type T.
 */
export const list = <T = number>(
  startOrLength: number,
  end?: number,
  valueOrMapper?: T | ((i: number) => T),
  step?: number
): T[] => {
  return Array.from(range(startOrLength, end, valueOrMapper, step))
}

/**
 * Flattens an array of arrays into a single array.
 * @param lists An array of arrays to be flattened.
 * @returns A single array containing all elements from the input arrays.
 */
export const flat = <T>(lists: readonly T[][]): T[] => {
  return lists.reduce((acc, list) => {
    acc.push(...list)
    return acc
  }, [])
}

/**
 * Checks if two lists intersect based on a provided identity function or default identity.
 * @param listA The first list to check for intersection.
 * @param listB The second list to check for intersection.
 * @param identity An optional function to extract a unique identifier from each element in the lists.
 * @returns A boolean indicating whether the lists intersect based on the provided identity function.
 */
export const intersects = <T, K extends string | number | symbol>(
  listA: readonly T[],
  listB: readonly T[],
  identity?: (t: T) => K
): boolean => {
  if (!listA || !listB) return false
  const ident = identity ?? ((x: T) => x as unknown as K)
  const dictB = listB.reduce((acc, item) => {
    acc[ident(item)] = true
    return acc
  }, {} as Record<string | number | symbol, boolean>)
  return listA.some(value => dictB[ident(value)])
}

/**
 * Forks an array into two based on a provided condition.
 *
 * @param list The array to be forked.
 * @param condition The condition to determine which array an item should be placed in.
 * @returns A tuple containing two arrays, the first containing items that satisfy the condition and the second containing items that do not.
 *
 * @example
 * const [even, odd] = fork([1, 2, 3, 4, 5], (n) => n % 2 === 0);
 * // even = [2, 4]
 * // odd = [1, 3, 5]
 */
export const fork = <T>(
  list: readonly T[],
  condition: (item: T) => boolean
): [T[], T[]] => {
  if (!list) return [[], []]
  return list.reduce(
    (acc, item) => {
      const [a, b] = acc
      if (condition(item)) {
        return [[...a, item], b]
      } else {
        return [a, [...b, item]]
      }
    },
    [[], []] as [T[], T[]]
  )
}

/**
 * Merges two arrays of objects based on a matching property.
 *
 * @param root - The main array to merge into.
 * @param others - The array to merge from.
 * @param matcher - A function that takes an item and returns a value to match on.
 * @returns A new array containing the merged items.
 *
 * @example
 * const root = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane' }]
 * const others = [{ id: 2, name: 'Jane Doe' }, { id: 3, name: 'Bob' }]
 * const merged = merge(root, others, item => item.id)
 * // merged = [{ id: 1, name: 'John' }, { id: 2, name: 'Jane Doe' }, { id: 3, name: 'Bob' }]
 */
export const merge = <T>(
  root: readonly T[],
  others: readonly T[],
  matcher: (item: T) => any
) => {
  if (!others && !root) return []
  if (!others) return root
  if (!root) return []
  if (!matcher) return root
  return root.reduce((acc, r) => {
    const matched = others.find(o => matcher(r) === matcher(o))
    if (matched) acc.push(matched)
    else acc.push(r)
    return acc
  }, [] as T[])
}

/**
 * Replaces an item in the given list that matches the provided condition with a new item, or appends the new item to the end of the list if no match is found.
 * @param list The list to search for a matching item.
 * @param newItem The new item to replace the matching item with or append to the end of the list.
 * @param match A function that takes an item and its index in the list, and returns a boolean indicating whether the item matches the desired condition.
 * @returns A new list with the matching item replaced or the new item appended.
 */
export const replaceOrAppend = <T>(
  list: readonly T[],
  newItem: T,
  match: (a: T, idx: number) => boolean
) => {
  if (!list && !newItem) return []
  if (!newItem) return [...list]
  if (!list) return [newItem]
  for (let idx = 0; idx < list.length; idx++) {
    const item = list[idx]
    if (match(item, idx)) {
      return [
        ...list.slice(0, idx),
        newItem,
        ...list.slice(idx + 1, list.length)
      ]
    }
  }
  return [...list, newItem]
}

/**
 * Toggles the presence of an item in a list.
 *
 * @typeParam T - The type of the items in the list.
 * @param list - The list to toggle the item in. If not provided, an empty list is returned.
 * @param item - The item to toggle. If not provided, the original list is returned.
 * @param toKey - An optional function to extract a key from each item in the list. If provided, the key is used to match the item instead of the item itself. If null, the item itself is used as the key.
 * @param options - An optional object containing additional options.
 * @param options.strategy - The strategy to use when adding the item to the list. If 'prepend', the item is added to the beginning of the list. If 'append' (default), the item is added to the end of the list.
 * @returns The list with the item toggled. If the item is already in the list, it is removed. If the item is not in the list, it is added.
 */
export const toggle = <T>(
  list: readonly T[],
  item: T,
  toKey?: null | ((item: T, idx: number) => number | string | symbol),
  options?: {
    strategy?: 'prepend' | 'append'
  }
) => {
  if (!list && !item) return []
  if (!list) return [item]
  if (!item) return [...list]
  const matcher = toKey
    ? (x: T, idx: number) => toKey(x, idx) === toKey(item, idx)
    : (x: T) => x === item
  const existing = list.find(matcher)
  if (existing) return list.filter((x, idx) => !matcher(x, idx))
  const strategy = options?.strategy ?? 'append'
  if (strategy === 'append') return [...list, item]
  return [item, ...list]
}

type Falsy = null | undefined | false | '' | 0 | 0n

/**
 * Filters out falsy values from the input list and returns an array of non-falsy values.
 * @param list - The input list of values, which can be of any type T or a falsy value.
 * @returns An array of non-falsy values of type T. If the input list is null or undefined, an empty array is returned.
 */
export const sift = <T>(list: readonly (T | Falsy)[]): T[] => {
  return (list?.filter(x => !!x) as T[]) ?? []
}

/**
 * Iterates over a range of numbers and applies a function to an initial value, returning the final result.
 * @param count The number of iterations to perform.
 * @param func A function to apply to the current value and iteration number, returning a new value.
 * @param initValue The initial value to pass to the function.
 * @returns The final result after all iterations have been performed.
 */
export const iterate = <T>(
  count: number,
  func: (currentValue: T, iteration: number) => T,
  initValue: T
) => {
  let value = initValue
  for (let i = 1; i <= count; i++) {
    value = func(value, i)
  }
  return value
}

/**
 * This function compares two arrays `root` and `other` and returns a new array that includes all elements from `root` that are not present in `other`.
 * The comparison is based on the identity of the elements, which is determined by the `identity` function.
 * If no `identity` function is provided, the elements are compared as strings, numbers, or symbols.
 * If both `root` and `other` are empty, an empty array is returned.
 * If `root` is empty, `other` is returned as is.
 * If `other` is empty, `root` is returned as is.
 * @param root - The first array to compare.
 * @param other - The second array to compare.
 * @param identity - A function that returns the identity of an element. Defaults to a function that returns the element as a string, number, or symbol.
 * @returns A new array that includes all elements from `root` that are not present in `other`.
 */
export const diff = <T>(
  root: readonly T[],
  other: readonly T[],
  identity: (item: T) => string | number | symbol = (t: T) =>
    t as unknown as string | number | symbol
): T[] => {
  if (!root?.length && !other?.length) return []
  if (root?.length === undefined) return [...other]
  if (!other?.length) return [...root]
  const bKeys = other.reduce((acc, item) => {
    acc[identity(item)] = true
    return acc
  }, {} as Record<string | number | symbol, boolean>)
  return root.filter(a => !bKeys[identity(a)])
}

/**
 * Shifts the elements of an array by a specified number of positions.
 *
 * @param arr The array to shift.
 * @param n The number of positions to shift the array. If negative, shifts to the left.
 * @returns A new array with the elements shifted. If the array is empty or the shift number is a multiple of the array length, returns the original array.
 *
 * @example
 * shift([1, 2, 3, 4, 5], 2) // returns [4, 5, 1, 2, 3]
 * shift([1, 2, 3, 4, 5], -1) // returns [2, 3, 4, 5, 1]
 */
export function shift<T>(arr: Array<T>, n: number) {
  if (arr.length === 0) return arr

  const shiftNumber = n % arr.length

  if (shiftNumber === 0) return arr

  return [...arr.slice(-shiftNumber, arr.length), ...arr.slice(0, -shiftNumber)]
}
