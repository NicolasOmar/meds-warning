import { describe, test, expect, vi, beforeEach } from 'vitest'
import { debounce } from '../helpers'

describe('[debounce]', () => {
  beforeEach(() => {
    vi.clearAllTimers()
    vi.useFakeTimers()
  })

  test('executes function after delay', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('test')
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(mockFn).toHaveBeenCalledWith('test')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  test('cancels previous call if invoked again within delay', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('first')
    vi.advanceTimersByTime(100)
    debouncedFn('second')
    vi.advanceTimersByTime(300)

    expect(mockFn).not.toHaveBeenCalledWith('first')
    expect(mockFn).toHaveBeenCalledWith('second')
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  test('accepts multiple arguments', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('arg1', 'arg2')
    vi.advanceTimersByTime(300)

    expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  test('resets timeout on each call', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('test')
    vi.advanceTimersByTime(200)
    expect(mockFn).not.toHaveBeenCalled()

    debouncedFn('test')
    vi.advanceTimersByTime(200)
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  test('handles rapid successive calls', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    for (let i = 0; i < 10; i++) {
      debouncedFn(`call${i}`)
      vi.advanceTimersByTime(50)
    }

    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(mockFn).toHaveBeenCalledTimes(1)
    expect(mockFn).toHaveBeenCalledWith('call9')
  })

  test('respects different delay values', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 500)

    debouncedFn('test')
    vi.advanceTimersByTime(300)
    expect(mockFn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(200)
    expect(mockFn).toHaveBeenCalledTimes(1)
  })

  test('can be called multiple times independently', () => {
    const mockFn = vi.fn()
    const debouncedFn = debounce(mockFn, 300)

    debouncedFn('first')
    vi.advanceTimersByTime(300)
    expect(mockFn).toHaveBeenCalledWith('first')

    debouncedFn('second')
    vi.advanceTimersByTime(300)
    expect(mockFn).toHaveBeenCalledWith('second')
    expect(mockFn).toHaveBeenCalledTimes(2)
  })
})
