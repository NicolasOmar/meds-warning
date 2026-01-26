import { describe, test, expect } from 'vitest'
// SHARED
import { parseMedicineToDataItem } from '../parsers'
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

    expect(result[0].expirationDate).toBe('2025-03-15')
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
