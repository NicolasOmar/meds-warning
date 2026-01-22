import { describe, test, expect } from 'vitest'
import { parseMedicineToDataItem } from './parsers'
import { MedicineTypeExtended } from '@shared-types/zod'

describe('[parseMedicineToDataItem]', () => {
  test('converts medicine list with all fields populated', () => {
    const medicineList: MedicineTypeExtended[] = [
      {
        id: 1,
        name: 'Aspirin',
        laboratory: 'Bayer',
        presentation: 1,
        medicinePresentation: {
          id: 1,
          description: 'Tablet'
        },
        expirationDate: new Date('2025-12-31'),
        usedFor: 'Pain relief',
        sideEffects: 'Nausea',
        comments: 'Take with food'
      }
    ]

    const result = parseMedicineToDataItem(medicineList)

    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      id: 1,
      name: 'Aspirin',
      laboratory: 'Bayer',
      presentation: 'Tablet',
      expirationDate: '2025-12-31',
      usedFor: 'Pain relief',
      sideEffects: 'Nausea',
      comments: 'Take with food'
    })
  })

  test('handles null optional fields', () => {
    const medicineList: MedicineTypeExtended[] = [
      {
        id: 2,
        name: 'Ibuprofen',
        laboratory: null,
        presentation: 2,
        medicinePresentation: {
          id: 2,
          description: 'Capsule'
        },
        expirationDate: null,
        usedFor: null,
        sideEffects: null,
        comments: null
      }
    ]

    const result = parseMedicineToDataItem(medicineList)

    expect(result[0]).toEqual({
      id: 2,
      name: 'Ibuprofen',
      laboratory: null,
      presentation: 'Capsule',
      expirationDate: null,
      usedFor: null,
      sideEffects: null,
      comments: null
    })
  })

  test('converts multiple medicines correctly', () => {
    const medicineList: MedicineTypeExtended[] = [
      {
        id: 1,
        name: 'Aspirin',
        laboratory: 'Bayer',
        presentation: 1,
        medicinePresentation: {
          id: 1,
          description: 'Tablet'
        },
        expirationDate: new Date('2025-12-31'),
        usedFor: 'Pain relief',
        sideEffects: 'Nausea',
        comments: 'Take with food'
      },
      {
        id: 2,
        name: 'Ibuprofen',
        laboratory: 'Pfizer',
        presentation: 2,
        medicinePresentation: {
          id: 2,
          description: 'Capsule'
        },
        expirationDate: new Date('2026-06-15'),
        usedFor: 'Fever',
        sideEffects: 'Dizziness',
        comments: 'Do not exceed dose'
      }
    ]

    const result = parseMedicineToDataItem(medicineList)

    expect(result).toHaveLength(2)
    expect(result[0].name).toBe('Aspirin')
    expect(result[1].name).toBe('Ibuprofen')
  })

  test('handles missing medicine presentation', () => {
    const medicineList: MedicineTypeExtended[] = [
      {
        id: 1,
        name: 'Paracetamol',
        laboratory: 'Generic',
        presentation: 1,
        medicinePresentation: undefined,
        expirationDate: new Date('2025-11-20'),
        usedFor: 'Headache',
        sideEffects: 'None',
        comments: ''
      }
    ]

    const result = parseMedicineToDataItem(medicineList)

    expect(result[0].presentation).toBe('')
  })

  test('formats date correctly to ISO string', () => {
    const medicineList: MedicineTypeExtended[] = [
      {
        id: 1,
        name: 'Vitamin C',
        laboratory: 'Nature Made',
        presentation: 1,
        medicinePresentation: {
          id: 1,
          description: 'Tablet'
        },
        expirationDate: new Date('2025-03-15T10:30:00Z'),
        usedFor: 'Immunity',
        sideEffects: 'None',
        comments: ''
      }
    ]

    const result = parseMedicineToDataItem(medicineList)

    expect(result[0].expirationDate).toBe('2025-03-15')
  })

  test('handles empty medicine list', () => {
    const medicineList: MedicineTypeExtended[] = []

    const result = parseMedicineToDataItem(medicineList)

    expect(result).toEqual([])
    expect(result).toHaveLength(0)
  })

  test('handles medicine with undefined id', () => {
    const medicineList: MedicineTypeExtended[] = [
      {
        id: undefined,
        name: 'Test Medicine',
        laboratory: 'Test Lab',
        presentation: 1,
        medicinePresentation: {
          id: 1,
          description: 'Tablet'
        },
        expirationDate: new Date('2025-12-31'),
        usedFor: 'Testing',
        sideEffects: 'None',
        comments: ''
      }
    ]

    const result = parseMedicineToDataItem(medicineList)

    expect(result[0].id).toBe(0)
  })

  test('preserves all medicine fields in correct order', () => {
    const medicineList: MedicineTypeExtended[] = [
      {
        id: 5,
        name: 'Medication X',
        laboratory: 'Lab X',
        presentation: 3,
        medicinePresentation: {
          id: 3,
          description: 'Syrup'
        },
        expirationDate: new Date('2025-09-01'),
        usedFor: 'Treatment X',
        sideEffects: 'Side X',
        comments: 'Comment X'
      }
    ]

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
