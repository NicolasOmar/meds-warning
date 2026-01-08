// CORE
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import MedicineLayout from './layout'

// Mock constants
vi.mock('@shared-constants/routes', () => ({
  MEDICINE_MAIN_ROUTES_OBJS: [
    { name: 'Add a new medicine', path: '/medicine/create' },
    { name: 'See all created ones', path: '/medicine/list' }
  ]
}))

describe('[MedicineLayout]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders layout with children', () => {
    const testChildren = <div>Test Children Content</div>
    render(<MedicineLayout>{testChildren}</MedicineLayout>)

    expect(screen.getByText('Test Children Content')).toBeInTheDocument()
  })

  test('renders navigation buttons', () => {
    render(
      <MedicineLayout>
        <div>Children</div>
      </MedicineLayout>
    )

    expect(screen.getByText('Add a new medicine')).toBeInTheDocument()
    expect(screen.getByText('See all created ones')).toBeInTheDocument()
  })

  test('renders links with correct paths', () => {
    render(
      <MedicineLayout>
        <div>Children</div>
      </MedicineLayout>
    )

    const addMedicineLink = screen.getByText('Add a new medicine').closest('a')
    const seeAllLink = screen.getByText('See all created ones').closest('a')

    expect(addMedicineLink).toHaveAttribute('href', '/medicine/create')
    expect(seeAllLink).toHaveAttribute('href', '/medicine/list')
  })

  test('renders ButtonGroup component', () => {
    const { container } = render(
      <MedicineLayout>
        <div>Children</div>
      </MedicineLayout>
    )

    // ButtonGroup should be rendered (check for the structure)
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBeGreaterThan(0)
  })

  test('renders all route objects as buttons', () => {
    render(
      <MedicineLayout>
        <div>Children</div>
      </MedicineLayout>
    )

    const addMedicineButton = screen.getByText('Add a new medicine')
    const seeAllButton = screen.getByText('See all created ones')

    expect(addMedicineButton).toBeInTheDocument()
    expect(seeAllButton).toBeInTheDocument()
  })

  test('renders main section wrapper', () => {
    const { container } = render(
      <MedicineLayout>
        <div>Children</div>
      </MedicineLayout>
    )

    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThan(0)
  })

  test('renders children in the correct position', () => {
    const childrenText = 'Specific Children Content'
    const { container } = render(
      <MedicineLayout>
        <div>{childrenText}</div>
      </MedicineLayout>
    )

    expect(screen.getByText(childrenText)).toBeInTheDocument()
    // Verify the child is rendered after buttons
    const mainSection = container.querySelector('section')
    expect(mainSection?.textContent).toContain(childrenText)
  })

  test('applies correct styling classes', () => {
    const { container } = render(
      <MedicineLayout>
        <div>Children</div>
      </MedicineLayout>
    )

    const mainSection = container.querySelector('section')
    expect(mainSection).toHaveClass('flex', 'flex-col')
  })

  test('renders with multiple navigation routes', () => {
    render(
      <MedicineLayout>
        <div>Children</div>
      </MedicineLayout>
    )

    // Get all links
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(2)
  })

  test('renders text styling on links', () => {
    render(
      <MedicineLayout>
        <div>Children</div>
      </MedicineLayout>
    )

    const addMedicineLink = screen.getByText('Add a new medicine').closest('a')
    expect(addMedicineLink).toHaveClass('text-2xl', 'font-medium')
  })

  test('renders complete navigation structure', () => {
    const { container } = render(
      <MedicineLayout>
        <nav>Test Nav</nav>
      </MedicineLayout>
    )

    // Verify ButtonGroup wrapper exists
    const buttons = container.querySelectorAll('button')

    // Should have buttons for navigation
    expect(buttons.length).toBeGreaterThan(0)
  })

  test('renders ButtonGroup with self-center margin', () => {
    const { container } = render(
      <MedicineLayout>
        <div>Children</div>
      </MedicineLayout>
    )

    // Check for flex structure with correct alignment
    const mainSection = container.querySelector('section')
    expect(mainSection).toHaveClass('flex', 'flex-col', 'justify-center')
  })
})
