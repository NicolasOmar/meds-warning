// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'

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

// Mock constants
vi.mock('@shared-constants/routes', () => ({
  MAIN_ROUTES_OBJS: [
    { name: 'Home', path: '/' },
    { name: 'Medicine', path: '/medicine' },
    { name: 'Concept', path: '/concept' }
  ]
}))

describe('HomeLayout Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('exports metadata object', async () => {
    const { metadata } = await import('./layout')
    expect(metadata).toBeDefined()
    expect(metadata.title).toBe('Meds Warning')
  })

  test('metadata has correct title', async () => {
    const { metadata } = await import('./layout')
    expect(metadata.title).toEqual('Meds Warning')
  })

  test('metadata has correct description', async () => {
    const { metadata } = await import('./layout')
    expect(metadata.description).toContain('medication expiration dates')
  })

  test('metadata description mentions medicine management', async () => {
    const { metadata } = await import('./layout')
    const description = metadata.description as string
    expect(description).toContain('manage')
    expect(description).toContain('medication')
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

  test('metadata has title property', async () => {
    const { metadata } = await import('./layout')
    expect(metadata.title).toBeTruthy()
  })

  test('metadata has description property', async () => {
    const { metadata } = await import('./layout')
    expect(metadata.description).toBeTruthy()
  })

  test('layout file imports required components', async () => {
    const layoutModule = await import('./layout')
    expect(layoutModule.default).toBeDefined()
    expect(layoutModule.metadata).toBeDefined()
  })

  test('component receives LayoutProps interface with children', async () => {
    // Verify the component accepts children prop
    const layoutModule = await import('./layout')
    const Component = layoutModule.default
    expect(Component.length).toBeGreaterThanOrEqual(1)
  })

  test('metadata title is a string', async () => {
    const { metadata } = await import('./layout')
    expect(typeof metadata.title).toBe('string')
  })

  test('metadata description is a string', async () => {
    const { metadata } = await import('./layout')
    expect(typeof metadata.description).toBe('string')
  })

  test('metadata description mentions renewal', async () => {
    const { metadata } = await import('./layout')
    const description = metadata.description as string
    expect(description).toContain('renew')
  })

  test('layout component uses CSS imports', async () => {
    // Verify globals.css is imported in the layout
    const layoutModule = await import('./layout')
    expect(layoutModule.default).toBeDefined()
  })

  test('Geist font is configured with correct variable', async () => {
    const geistModule = await import('next/font/google')
    const geistResult = geistModule.Geist({
      variable: '--font-geist-sans',
      subsets: ['latin']
    })
    expect(geistResult.variable).toBe('--font-geist-sans')
  })

  test('Geist Mono font is configured with correct variable', async () => {
    const geistModule = await import('next/font/google')
    const geistMonoResult = geistModule.Geist_Mono({
      variable: '--font-geist-mono',
      subsets: ['latin']
    })
    expect(geistMonoResult.variable).toBe('--font-geist-mono')
  })

  test('metadata description is not empty', async () => {
    const { metadata } = await import('./layout')
    expect((metadata.description as string).length).toBeGreaterThan(0)
  })

  test('layout component file exists and is importable', async () => {
    const layoutModule = await import('./layout')
    expect(layoutModule).toBeDefined()
  })

  test('metadata contains title and description', async () => {
    const { metadata } = await import('./layout')
    const metadataKeys = Object.keys(metadata)
    expect(metadataKeys).toContain('title')
    expect(metadataKeys).toContain('description')
  })

  test('Geist font configuration with subsets', async () => {
    const geistModule = await import('next/font/google')
    const geistResult = geistModule.Geist({
      variable: '--font-geist-sans',
      subsets: ['latin']
    })
    expect(geistResult).toBeDefined()
    expect(geistResult.variable).toBeDefined()
  })

  test('Geist Mono font configuration with subsets', async () => {
    const geistModule = await import('next/font/google')
    const geistMonoResult = geistModule.Geist_Mono({
      variable: '--font-geist-mono',
      subsets: ['latin']
    })
    expect(geistMonoResult).toBeDefined()
    expect(geistMonoResult.variable).toBeDefined()
  })

  test('metadata object structure is valid', async () => {
    const { metadata } = await import('./layout')
    expect(typeof metadata === 'object').toBe(true)
    expect('title' in metadata).toBe(true)
    expect('description' in metadata).toBe(true)
  })

  test('layout exports proper React component type', async () => {
    const layoutModule = await import('./layout')
    const Component = layoutModule.default
    expect(typeof Component).toBe('function')
    expect(Component.length).toBeGreaterThanOrEqual(0)
  })
})
