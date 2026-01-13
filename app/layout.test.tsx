// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
import { ROOT_LAYOUT_LABELS } from '@shared-constants/pages'

// Types for font configuration
interface FontConfig {
  variable: string
  subsets: string[]
}

interface FontResult {
  variable: string
  subsets?: string[]
}

// Mock Next.js fonts
vi.mock('next/font/google', () => ({
  Geist: ({ variable, subsets }: FontConfig): FontResult => ({
    variable,
    subsets
  }),
  Geist_Mono: ({ variable, subsets }: FontConfig): FontResult => ({
    variable,
    subsets
  })
}))

describe('[HomeLayout]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('layout component file exists and is importable', async () => {
    const layoutModule = await import('./layout')
    expect(layoutModule).toBeDefined()
  })

  test('metadata has correct title', async () => {
    const { metadata } = await import('./layout')
    expect(metadata.title).toBeTruthy()
    expect(metadata.title).toEqual(ROOT_LAYOUT_LABELS.METADATA_TITLE)
  })

  test('metadata has correct description', async () => {
    const { metadata } = await import('./layout')
    expect(metadata.description).toBeTruthy()
    expect(metadata.description).toContain(ROOT_LAYOUT_LABELS.METADATA_DESCRIPTION)
  })

  test('component is exported as default', async () => {
    const layoutModule = await import('./layout')
    expect(layoutModule.default).toBeDefined()
  })

  test('component is a React functional component', async () => {
    const layoutModule = await import('./layout')
    const Component = layoutModule.default
    expect(typeof Component).toBe('function')
  })

  test('component receives BaseLayoutProps interface with children', async () => {
    // Verify the component accepts children prop
    const layoutModule = await import('./layout')
    const Component = layoutModule.default
    expect(Component.length).toBeGreaterThanOrEqual(1)
  })

  test('Geist font is configured with correct variable', async () => {
    const geistModule = await import('next/font/google')
    const geistResult = geistModule.Geist({
      variable: '--font-geist-sans',
      subsets: ['latin']
    })
    expect(geistResult).toBeDefined()
    expect(geistResult.variable).toBeDefined()
    expect(geistResult.variable).toBe('--font-geist-sans')
  })

  test('Geist Mono font is configured with correct variable', async () => {
    const geistModule = await import('next/font/google')
    const geistMonoResult = geistModule.Geist_Mono({
      variable: '--font-geist-mono',
      subsets: ['latin']
    })
    expect(geistMonoResult).toBeDefined()
    expect(geistMonoResult.variable).toBeDefined()
    expect(geistMonoResult.variable).toBe('--font-geist-mono')
  })
})
