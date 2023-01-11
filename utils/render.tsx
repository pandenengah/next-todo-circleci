export const isServer = (): Boolean => {
  if (typeof window === 'undefined') {
    return true
  }
  return false
}
