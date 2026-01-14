// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { notFound } from 'next/navigation'
import { prisma } from '@prisma/index'
// COMPONENTS
import UpdatePresentationPage from './page'
// MOCKS
import { firstPresentationResponse, secondPresentationResponse } from './mocks.json'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  notFound: vi.fn()
}))

// Mock prisma
vi.mock('@prisma/index', () => ({
  prisma: {
    medicinePresentation: {
      findFirst: vi.fn()
    }
  }
}))

describe('[UpdatePresentationPage]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders PresentationForm with presentation data', async () => {
    vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValueOnce(
      firstPresentationResponse
    )

    const params = Promise.resolve({ id: '1' })
    const component = await UpdatePresentationPage({ params })
    render(component)

    expect(screen.getByDisplayValue(firstPresentationResponse.description)).toBeInTheDocument()
  })

  test('calls prisma.medicinePresentation.findFirst with correct id parameter', async () => {
    vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValueOnce(
      firstPresentationResponse
    )

    const params = Promise.resolve({ id: '1' })
    await UpdatePresentationPage({ params })

    expect(prisma.medicinePresentation.findFirst).toHaveBeenCalledWith({
      where: { id: 1 }
    })
  })

  test('calls notFound when id is missing', async () => {
    const params = Promise.resolve({ id: '' })

    await UpdatePresentationPage({ params })

    expect(notFound).toHaveBeenCalled()
  })

  test('calls notFound when id is not a valid number', async () => {
    const params = Promise.resolve({ id: 'invalid' })

    await UpdatePresentationPage({ params })

    expect(notFound).toHaveBeenCalled()
  })

  test('calls notFound when presentation is not found in database', async () => {
    vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValueOnce(null)

    const params = Promise.resolve({ id: '999' })

    await UpdatePresentationPage({ params })

    expect(notFound).toHaveBeenCalled()
  })

  test('renders PresentationForm with different presentation data', async () => {
    vi.mocked(prisma.medicinePresentation.findFirst).mockResolvedValueOnce(
      secondPresentationResponse
    )

    const params = Promise.resolve({ id: '2' })
    const component = await UpdatePresentationPage({ params })
    render(component)

    expect(screen.getByDisplayValue(secondPresentationResponse.description)).toBeInTheDocument()
  })

  test('calls notFound with id containing only zeros', async () => {
    const params = Promise.resolve({ id: '0' })

    await UpdatePresentationPage({ params })

    // ID '0' converts to number 0 which is falsy
    // The condition checks !id which evaluates to true for 0
    // Therefore notFound is called
    expect(notFound).toHaveBeenCalled()
  })
})
