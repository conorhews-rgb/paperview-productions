import { useEffect, useState } from 'react'

/** useState that survives reloads via localStorage (silently skips if blocked). */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? { ...initial, ...JSON.parse(raw) } : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable — keep in memory only */
    }
  }, [key, value])
  return [value, setValue]
}
