/**
 * Creates a debounced version of a function that delays its execution.
 * Useful for handling frequent events like search input changes.
 * @param func The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced function that accepts the same parameters as the original
 */
export const debounce = <Args extends unknown[]>(
  func: (...args: Args) => void,
  delay: number
): ((...args: Args) => void) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Args): void => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
      timeoutId = null
    }, delay)
  }
}
