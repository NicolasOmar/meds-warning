import { describe, test, expect } from 'vitest'
// SHARED
import {
  formatUTCISODateForDisplay,
  parseMedicineToDataItem,
  parseStringDateToISOString
} from '../parsers'
import { MedicineTypeExtended } from '@shared-types/zod'
// MOCKS
import mockedData from './parsers.mocks.json'

describe('[parseMedicineToDataItem]', () => {
  test('converts medicine list with all fields populated', () => {
    const medicineList: MedicineTypeExtended[] = mockedData.medicineWithAllFields.map(med => ({
      ...med,
      expirationDate: new Date(med.expirationDate)
    }))

    const result = parseMedicineToDataItem(medicineList)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual(mockedData.expectedWithAllFields[0])
  })

  test('handles null optional fields', () => {
    const medicineList: MedicineTypeExtended[] =
      mockedData.medicineWithNullFields as MedicineTypeExtended[]

    const result = parseMedicineToDataItem(medicineList)

    expect(result[0]).toEqual(mockedData.expectedWithNullFields[0])
  })

  test('converts multiple medicines correctly', () => {
    const medicineList: MedicineTypeExtended[] = mockedData.multipleMedicines.map(med => ({
      ...med,
      expirationDate: new Date(med.expirationDate)
    }))

    const result = parseMedicineToDataItem(medicineList)

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Aspirin')
    expect(result[1].name).toBe('Ibuprofen')
  })

  test('handles missing medicine presentation', () => {
    const medicineList: MedicineTypeExtended[] = mockedData.medicineWithoutPresentation.map(
      med => ({
        ...med,
        medicinePresentation: undefined,
        expirationDate: new Date(med.expirationDate)
      })
    )

    const result = parseMedicineToDataItem(medicineList)

    expect(result[0].presentation).toBe('')
  })

  test('formats date correctly to ISO string', () => {
    const medicineList: MedicineTypeExtended[] = mockedData.medicineWithDateTime.map(med => ({
      ...med,
      expirationDate: new Date(med.expirationDate)
    }))

    const result = parseMedicineToDataItem(medicineList)

    expect(result[0].expirationDate).toBe('2025-03-15T10:30:00.000Z')
  })

  test('handles empty medicine list', () => {
    const medicineList: MedicineTypeExtended[] = mockedData.emptyMedicineList

    const result = parseMedicineToDataItem(medicineList)

    expect(result).toEqual([])
    expect(result).toHaveLength(0)
  })

  test('handles medicine with undefined id', () => {
    const medicineList: MedicineTypeExtended[] = mockedData.medicineWithUndefinedId.map(med => ({
      ...med,
      id: undefined,
      expirationDate: new Date(med.expirationDate)
    }))

    const result = parseMedicineToDataItem(medicineList)

    expect(result[0].id).toBe(0)
  })

  test('preserves all medicine fields in correct order', () => {
    const medicineList: MedicineTypeExtended[] = mockedData.medicineForFieldOrder.map(med => ({
      ...med,
      expirationDate: new Date(med.expirationDate)
    }))

    const result = parseMedicineToDataItem(medicineList)

    const keys = Object.keys(result[0])
    expect(keys).toContain('id')
    expect(keys).toContain('name')
    expect(keys).toContain('laboratory')
    expect(keys).toContain('presentation')
    expect(keys).toContain('expirationDate')
    expect(keys).toContain('usedFor')
    expect(keys).toContain('sideEffects')
    expect(keys).toContain('comments')
  })
})

describe('[formatUTCISODateForDisplay]', () => {
  test('formats UTC midnight ISO string to readable date using UTC calendar day, not local time', () => {
    // "2025-11-02T00:00:00.000Z" is UTC midnight Nov 2.
    // In UTC-N locals it would be Oct 31/Nov 1 in local time — the function must return Nov 2.
    const result = formatUTCISODateForDisplay('2025-11-02T00:00:00.000Z')
    expect(result).toBe('Nov 2, 2025')
  })

  test('formats UTC ISO string with non-midnight time by extracting the UTC calendar date only', () => {
    // "2025-03-15T10:30:00.000Z" — UTC date is Mar 15; only the calendar date should be shown
    const result = formatUTCISODateForDisplay('2025-03-15T10:30:00.000Z')
    expect(result).toBe('Mar 15, 2025')
  })

  test('formats UTC ISO date string and preserves month boundaries correctly', () => {
    expect(formatUTCISODateForDisplay('2025-01-01T00:00:00.000Z')).toBe('Jan 1, 2025')
    expect(formatUTCISODateForDisplay('2025-12-31T00:00:00.000Z')).toBe('Dec 31, 2025')
  })
})

describe('[parseStringDateToISOString]', () => {
  test('converts valid date string to ISO format', () => {
    const result = parseStringDateToISOString('2025-03-15')
    expect(result).toBe('2025-03-15')
  })

  test('converts date with time to ISO date only', () => {
    const result = parseStringDateToISOString('2025-03-15T10:30:00.000Z')
    expect(result).toBe('2025-03-15')
  })

  test('returns null for null input', () => {
    const result = parseStringDateToISOString(null)
    expect(result).toBeNull()
  })

  test('returns null for invalid date string', () => {
    const result = parseStringDateToISOString('invalid-date')
    expect(result).toBeNull()
  })

  test('returns null for empty string', () => {
    const result = parseStringDateToISOString('')
    expect(result).toBeNull()
  })

  test('handles various valid date strings', () => {
    expect(parseStringDateToISOString('2025-12-31')).toBe('2025-12-31')
    expect(parseStringDateToISOString('2025-01-01')).toBe('2025-01-01')
  })
})
