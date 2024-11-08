import { list } from './array'

export const series = <T>(
  items: T[],
  toKey: (item: T) => string | symbol = item => `${item}`
) => {
  const { indexesByKey, itemsByIndex } = items.reduce(
    (acc, item, idx) => ({
      indexesByKey: {
        ...acc.indexesByKey,
        [toKey(item)]: idx
      },
      itemsByIndex: {
        ...acc.itemsByIndex,
        [idx]: item
      }
    }),
    {
      indexesByKey: {} as Record<string | symbol, number>,
      itemsByIndex: {} as Record<number, T>
    }
  )
  const min = (a: T, b: T): T => {
    return indexesByKey[toKey(a)] < indexesByKey[toKey(b)] ? a : b
  }
  const max = (a: T, b: T): T => {
    return indexesByKey[toKey(a)] > indexesByKey[toKey(b)] ? a : b
  }
  const first = (): T => {
    return itemsByIndex[0]
  }
  const last = (): T => {
    return itemsByIndex[items.length - 1]
  }
  const next = (current: T, defaultValue?: T): T => {
    return (
      itemsByIndex[indexesByKey[toKey(current)] + 1] ?? defaultValue ?? first()
    )
  }
  const previous = (current: T, defaultValue?: T): T => {
    return (
      itemsByIndex[indexesByKey[toKey(current)] - 1] ?? defaultValue ?? last()
    )
  }
  const spin = (current: T, num: number): T => {
    if (num === 0) return current
    const abs = Math.abs(num)
    const rel = abs > items.length ? abs % items.length : abs
    return list(0, rel - 1).reduce(
      acc => (num > 0 ? next(acc) : previous(acc)),
      current
    )
  }
  return {
    min,
    max,
    first,
    last,
    next,
    previous,
    spin
  }
}
