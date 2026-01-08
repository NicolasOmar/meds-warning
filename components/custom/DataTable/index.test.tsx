// CORE
import { describe, test, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
// COMPONENTS
import DataTable from './index'
// SHARED
import { COMMON_TABLE_ERRORS } from '@shared-constants/labels'
// MOCKS
import {
  baseHeaders,
  baseTestData,
  customNoDataMessage,
  customTableTitle,
  complexHeaders,
  complexTestData,
  mixedHeaders,
  mixedData,
  numericHeaders,
  numericData
} from './mocks.json'

describe('[DataTable]', () => {
  interface TestData {
    id: number
    name: string
    description: string
  }

  test('renders table with data when data is provided', () => {
    render(<DataTable<TestData> headers={baseHeaders} data={baseTestData} />)

    baseHeaders.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
    baseTestData.forEach(item => {
      expect(screen.getByText(item.name)).toBeInTheDocument()
      expect(screen.getByText(item.description)).toBeInTheDocument()
    })
  })

  test('renders no data message when data array is empty', () => {
    const { container } = render(<DataTable<TestData> headers={baseHeaders} data={[]} />)

    const table = container.querySelector('table')
    expect(table).not.toBeInTheDocument()
    expect(screen.getByText(COMMON_TABLE_ERRORS.NO_DATA)).toBeInTheDocument()
  })

  test('renders custom no data message when provided', () => {
    const { container } = render(
      <DataTable<TestData> headers={baseHeaders} data={[]} noDataMessage={customNoDataMessage} />
    )

    const table = container.querySelector('table')
    expect(table).not.toBeInTheDocument()
    expect(screen.getByText(customNoDataMessage)).toBeInTheDocument()
  })

  test('renders title when title prop is provided', () => {
    render(
      <DataTable<TestData> title={customTableTitle} headers={baseHeaders} data={baseTestData} />
    )

    expect(screen.getByText(customTableTitle)).toBeInTheDocument()
  })

  test('handles null values by displaying dash', () => {
    interface DataWithNulls {
      id: number
      name: string
      description: string | null
    }

    const mockData: DataWithNulls[] = baseTestData.map(item => ({
      ...item,
      description: null
    }))

    render(<DataTable<DataWithNulls> headers={baseHeaders} data={mockData} />)

    mockData.forEach(item => {
      expect(screen.getByText(item.id)).toBeInTheDocument()
      expect(screen.getByText(item.name)).toBeInTheDocument()
    })

    const dashElements = screen.getAllByText('-')
    expect(dashElements.length).toBe(mockData.length)
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

    render(<DataTable<ComplexData> headers={complexHeaders} data={complexTestData} />)

    complexHeaders.forEach(header => {
      expect(screen.getByText(header)).toBeInTheDocument()
    })
    complexTestData.forEach(item => {
      expect(screen.getByText(item.id)).toBeInTheDocument()
      expect(screen.getByText(item.firstName)).toBeInTheDocument()
      expect(screen.getByText(item.lastName)).toBeInTheDocument()
      expect(screen.getByText(item.email)).toBeInTheDocument()
    })
  })

  test('renders table structure elements correctly', () => {
    const mockData: TestData[] = [{ id: 1, name: 'Test', description: 'Test' }]

    const { container } = render(<DataTable<TestData> headers={baseHeaders} data={mockData} />)

    const table = container.querySelector('table')
    const thead = container.querySelector('thead')
    const tbody = container.querySelector('tbody')
    const headerCells = container.querySelectorAll('th')
    const bodyCells = container.querySelectorAll('td')

    expect(table).toBeInTheDocument()
    expect(thead).toBeInTheDocument()
    expect(tbody).toBeInTheDocument()
    expect(headerCells.length).toBe(baseHeaders.length)
    expect(bodyCells.length).toBe(mockData.length * baseHeaders.length)
  })

  test('handles data with mixed null and non-null values', () => {
    interface MixedData {
      id: number
      name: string | null
      age: number | null
      city: string | null
    }

    render(<DataTable<MixedData> headers={mixedHeaders} data={mixedData} />)

    mixedData.forEach(item => {
      Object.values(item).forEach(value => {
        if (value !== null) {
          expect(screen.getByText(String(value))).toBeInTheDocument()
        }
      })

      const dashElements = screen.getAllByText('-')
      expect(dashElements.length).toBeGreaterThanOrEqual(mixedData.length)
    })
  })

  test('renders numeric values as strings', () => {
    interface NumericData {
      id: number
      count: number
      price: number
    }

    render(<DataTable<NumericData> headers={numericHeaders} data={numericData} />)

    numericData.forEach(item => {
      expect(screen.getByText(String(item.id))).toBeInTheDocument()
      expect(screen.getByText(String(item.count))).toBeInTheDocument()
      expect(screen.getByText(String(item.price))).toBeInTheDocument()
    })
  })
})
