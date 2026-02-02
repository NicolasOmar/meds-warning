import { describe, test, expect, vi, beforeEach } from 'vitest'
import '@testing-library/jest-dom'
// COMPONENT
import UserPage from './page'

vi.mock('@prisma/index', () => ({
  prisma: {}
}))

describe('[UserPage]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders the user creation page', async () => {
    const component = await UserPage({})
    expect(component).toBeDefined()
    expect(component).toBeTruthy()
  })
})
