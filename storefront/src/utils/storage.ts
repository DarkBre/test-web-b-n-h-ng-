export const readStorage = <T,>(key: string, fallback: T) => {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export const readSessionStorage = <T,>(key: string, fallback: T) => {
  const raw = sessionStorage.getItem(key)
  if (!raw) return fallback

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
