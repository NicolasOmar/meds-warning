// CORE
import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import DataTable from './index'
// SHARED
import { COMMON_TABLE_ERRORS } from '@shared-constants/labels'

describe('[DataTable]', () => {
  interface TestData {
    id: number
    name: string
    description: string
  }

  const mockHeaders = ['ID', 'Name', 'Description']

  test('renders table with data when data is provided', () => {
    const mockData: TestData[] = [
      { id: 1, name: 'Item 1', description: 'Description 1' },
      { id: 2, name: 'Item 2', description: 'Description 2' }
    ]

    render(<DataTable<TestData> headers={mockHeaders} data={mockData} />)

    expect(screen.getByText('ID')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByText('Item 2')).toBeInTheDocument()
  })

  test('renders table headers correctly', () => {
    const mockData: TestData[] = [{ id: 1, name: 'Test', description: 'Test' }]

    render(<DataTable<TestData> headers={mockHeaders} data={mockData} />)

    mockHeaders.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
  })

  test('renders all data cells with correct values', () => {
    const mockData: TestData[] = [
      { id: 1, name: 'Alice', description: 'Developer' },
      { id: 2, name: 'Bob', description: 'Designer' }
    ]

    render(<DataTable<TestData> headers={mockHeaders} data={mockData} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Developer')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Designer')).toBeInTheDocument()
  })

  test('renders no data message when data array is empty', () => {
    render(<DataTable<TestData> headers={mockHeaders} data={[]} />)

    expect(screen.getByText(COMMON_TABLE_ERRORS.NO_DATA)).toBeInTheDocument()
  })

  test('renders custom no data message when provided', () => {
    const customMessage = 'No items available'

    render(<DataTable<TestData> headers={mockHeaders} data={[]} noDataMessage={customMessage} />)

    expect(screen.getByText(customMessage)).toBeInTheDocument()
  })

  test('renders title when title prop is provided', () => {
    const mockData: TestData[] = [{ id: 1, name: 'Test', description: 'Test' }]
    const title = 'Test Table'

    render(<DataTable<TestData> title={title} headers={mockHeaders} data={mockData} />)

    expect(screen.getByText(title)).toBeInTheDocument()
  })

  test('does not render title when title prop is not provided', () => {
    const mockData: TestData[] = [{ id: 1, name: 'Test', description: 'Test' }]

    const { container } = render(<DataTable<TestData> headers={mockHeaders} data={mockData} />)

    // Should render table but not FieldLabel
    const fieldLabel = container.querySelector('[class*="field"]')
    expect(fieldLabel).not.toBeInTheDocument()
  })

  test('handles null values by displaying dash', () => {
    interface DataWithNulls {
      id: number
      name: string | null
      description: string | null
    }

    const mockData: DataWithNulls[] = [{ id: 1, name: null, description: 'Description' }]

    const headersForNulls = ['ID', 'Name', 'Description']

    render(<DataTable<DataWithNulls> headers={headersForNulls} data={mockData} />)

    const dashElements = screen.getAllByText('-')
    expect(dashElements.length).toBeGreaterThan(0)
  })

  test('renders single row with single column correctly', () => {
    interface SimpleData {
      value: string
    }

    const mockData: SimpleData[] = [{ value: 'Single Value' }]

    render(<DataTable<SimpleData> headers={['Value']} data={mockData} />)

    expect(screen.getByText('Single Value')).toBeInTheDocument()
  })

  test('renders multiple rows with multiple columns', () => {
    interface ComplexData {
      id: number
      firstName: string
      lastName: string
      email: string
    }

    const mockData: ComplexData[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' },
      { id: 3, firstName: 'Bob', lastName: 'Johnson', email: 'bob@example.com' }
    ]

    const complexHeaders = ['ID', 'First Name', 'Last Name', 'Email']

    render(<DataTable<ComplexData> headers={complexHeaders} data={mockData} />)

    // Verify headers
    complexHeaders.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })

    // Verify all data rows
    expect(screen.getByText('John')).toBeInTheDocument()
    expect(screen.getByText('Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
    expect(screen.getByText('Jane')).toBeInTheDocument()
    expect(screen.getByText('Smith')).toBeInTheDocument()
    expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    expect(screen.getByText('Johnson')).toBeInTheDocument()
    expect(screen.getByText('bob@example.com')).toBeInTheDocument()
  })

  test('renders table structure elements correctly', () => {
    const mockData: TestData[] = [{ id: 1, name: 'Test', description: 'Test' }]

    const { container } = render(<DataTable<TestData> headers={mockHeaders} data={mockData} />)

    const table = container.querySelector('table')
    const thead = container.querySelector('thead')
    const tbody = container.querySelector('tbody')
    const headerCells = container.querySelectorAll('th')
    const bodyCells = container.querySelectorAll('td')

    expect(table).toBeInTheDocument()
    expect(thead).toBeInTheDocument()
    expect(tbody).toBeInTheDocument()
    expect(headerCells.length).toBe(mockHeaders.length)
    expect(bodyCells.length).toBe(mockData.length * mockHeaders.length)
  })

  test('renders table with title and data together', () => {
    const mockData: TestData[] = [{ id: 1, name: 'Test', description: 'Test' }]
    const title = 'My Table'

    const { container } = render(
      <DataTable<TestData> title={title} headers={mockHeaders} data={mockData} />
    )

    expect(screen.getByText(title)).toBeInTheDocument()
    const table = container.querySelector('table')
    expect(table).toBeInTheDocument()
  })

  test('renders empty table with only headers when data is provided but empty rows', () => {
    const { container } = render(<DataTable<TestData> headers={mockHeaders} data={[]} />)

    // Empty data should show no data message instead of table
    expect(screen.getByText(COMMON_TABLE_ERRORS.NO_DATA)).toBeInTheDocument()
    const table = container.querySelector('table')
    expect(table).not.toBeInTheDocument()
  })

  test('handles data with mixed null and non-null values', () => {
    interface MixedData {
      id: number
      name: string | null
      age: number | null
      city: string | null
    }

    const mockData: MixedData[] = [
      { id: 1, name: 'Alice', age: 30, city: null },
      { id: 2, name: null, age: 25, city: 'NYC' },
      { id: 3, name: 'Bob', age: null, city: 'LA' }
    ]

    render(<DataTable<MixedData> headers={['ID', 'Name', 'Age', 'City']} data={mockData} />)

    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('30')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
    const dashElements = screen.getAllByText('-')
    expect(dashElements.length).toBeGreaterThanOrEqual(3)
  })

  test('renders numeric values as strings', () => {
    interface NumericData {
      id: number
      count: number
      price: number
    }

    const mockData: NumericData[] = [{ id: 1, count: 100, price: 99.99 }]

    render(<DataTable<NumericData> headers={['ID', 'Count', 'Price']} data={mockData} />)

    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('99.99')).toBeInTheDocument()
  })
})
