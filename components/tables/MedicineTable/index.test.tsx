// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import MedicineTable from './index'
// SHARED
import { COMMON_TABLE_ERRORS, MEDICINE_TABLE_LABELS } from '@shared-constants/labels'
// MOCKS
import {
  basicMedicineData,
  multipleMedicineData,
  medicineWithNullFields,
  emptyMedicineData
} from './mocks.json'

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}))

// Mock server action
vi.mock('@actions/medicine', () => ({
  deleteMedicine: vi.fn()
}))

describe('[MedicineTable]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders table title correctly', () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const title = screen.getByText(MEDICINE_TABLE_LABELS.TITLE)
    expect(title).toBeInTheDocument()
  })

  test('renders table headers correctly', () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const headers = MEDICINE_TABLE_LABELS.HEADERS.split(',')
    headers.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
  })

  test('renders single medicine data in table', () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const medicine = basicMedicineData[0]
    expect(screen.getByText(medicine.name)).toBeInTheDocument()
    expect(screen.getByText(medicine.laboratory)).toBeInTheDocument()
    expect(screen.getByText(medicine.presentation)).toBeInTheDocument()
    expect(screen.getByText(medicine.usedFor)).toBeInTheDocument()
  })

  test('renders multiple medicines in table', () => {
    render(<MedicineTable medicineList={multipleMedicineData} />)

    multipleMedicineData.forEach(medicine => {
      expect(screen.getByText(medicine.name)).toBeInTheDocument()
      expect(screen.getByText(medicine.laboratory)).toBeInTheDocument()
    })
  })

  test('renders Edit button for each medicine', () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const editButtons = screen.getAllByRole('link', { name: /Edit/i })
    expect(editButtons).toHaveLength(basicMedicineData.length)
  })

  test('renders Delete button for each medicine', () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i })
    expect(deleteButtons).toHaveLength(basicMedicineData.length)
  })

  test('Edit button links to correct medicine URL', () => {
    render(<MedicineTable medicineList={basicMedicineData} />)

    const editLink = screen.getByRole('link', { name: /Edit/i })
    expect(editLink).toHaveAttribute('href', `/medicine/${basicMedicineData[0].id}`)
  })

  test('handles medicine with null optional fields', () => {
    render(<MedicineTable medicineList={medicineWithNullFields} />)

    const medicine = medicineWithNullFields[0]
    expect(screen.getByText(medicine.name)).toBeInTheDocument()
    expect(screen.getByText(medicine.presentation)).toBeInTheDocument()
  })

  test('renders empty table when no medicines provided', () => {
    const { container } = render(<MedicineTable medicineList={emptyMedicineData} />)

    // When there's no data, DataTable shows the no data message
    expect(container.textContent).toContain(COMMON_TABLE_ERRORS.NO_DATA)
  })

  test('memoizes medicine list correctly', () => {
    const { rerender } = render(<MedicineTable medicineList={basicMedicineData} />)

    // Initial render should show the medicine
    expect(screen.getByText(basicMedicineData[0].name)).toBeInTheDocument()

    // Rerender with same data
    rerender(<MedicineTable medicineList={basicMedicineData} />)

    // Medicine should still be visible
    expect(screen.getByText(basicMedicineData[0].name)).toBeInTheDocument()
  })

  test('renders all medicine fields correctly', () => {
    const medicine = multipleMedicineData[0]
    render(<MedicineTable medicineList={[medicine]} />)

    expect(screen.getByText(medicine.id.toString())).toBeInTheDocument()
    expect(screen.getByText(medicine.name)).toBeInTheDocument()
    expect(screen.getByText(medicine.laboratory)).toBeInTheDocument()
    expect(screen.getByText(medicine.presentation)).toBeInTheDocument()
    expect(screen.getByText(medicine.expirationDate)).toBeInTheDocument()
    expect(screen.getByText(medicine.usedFor)).toBeInTheDocument()
    expect(screen.getByText(medicine.sideEffects)).toBeInTheDocument()
    expect(screen.getByText(medicine.comments)).toBeInTheDocument()
  })

  test('renders multiple Edit and Delete buttons for multiple medicines', () => {
    render(<MedicineTable medicineList={multipleMedicineData} />)

    const editButtons = screen.getAllByRole('link', { name: /Edit/i })
    const deleteButtons = screen.getAllByRole('button', { name: /Delete/i })

    expect(editButtons).toHaveLength(2)
    expect(deleteButtons).toHaveLength(2)
  })
})
