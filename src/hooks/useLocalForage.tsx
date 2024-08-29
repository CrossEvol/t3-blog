import localforage from 'localforage'
import { useCallback } from 'react'

const useLocalForage = () => {
  const saveToForage = useCallback(async <K, V>(key: K, data: V) => {
    const keyString = typeof key === 'string' ? key : JSON.stringify(key)
    await localforage.setItem<V>(keyString, data)
  }, [])

  const loadFromForage = useCallback(async <K, V>(key: K) => {
    const keyString = typeof key === 'string' ? key : JSON.stringify(key)
    const storageString = await localforage.getItem<V>(keyString)
    return storageString ?? undefined
  }, [])

  const removeFromForage = useCallback(async (key: unknown) => {
    const keyString = typeof key === 'string' ? key : JSON.stringify(key)
    await localforage.removeItem(keyString)
  }, [])

  return { saveToForage, loadFromForage, removeFromForage }
}

export default useLocalForage
