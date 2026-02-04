// CORE
import { describe, test, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import SettingsRootPage from './page'

vi.mock('@shared-functions/auth', () => ({
  getSession: vi.fn().mockResolvedValue({ user: { id: 1, email: 'test@test.com', name: 'Test' } })
}))

vi.mock('@prisma/index', () => ({
  prisma: {
    user: {
      findUnique: vi.fn().mockResolvedValue({ id: 1, daysToNotify: 45 })
    }
  }
}))

vi.mock('@form-components/SettingsForm', () => ({
  default: ({ userDaysToNotify }: { userDaysToNotify: number }) => (
    <div>Mocked SettingsForm {userDaysToNotify}</div>
  )
}))

describe('[SettingsRootPage]', () => {
  test('renders SettingsForm with user daysToNotify from database', async () => {
    const component = await SettingsRootPage({})
    render(component)

    expect(screen.getByText('Mocked SettingsForm 45')).toBeInTheDocument()
  })

  test('calls prisma.user.findUnique with session user id', async () => {
    const { prisma } = await import('@prisma/index')

    await SettingsRootPage({})

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 }
    })
  })

  test('is an async functional component', () => {
    expect(typeof SettingsRootPage).toBe('function')
  })
})
