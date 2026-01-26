import { MedicineTypeExtended } from '@shared-types/zod'

interface MedicineTableDataItem {
  id: number
  name: string
  laboratory: string | null
  presentation: string
  expirationDate: string | null
  usedFor: string | null
  sideEffects: string | null
  comments: string | null
  actions?: React.ReactNode
}

export const parseStringDateToISOString = (dateString: string | null): string | null => {
  if (!dateString) return null

  const parsedToDate = new Date(dateString)
  return Number.isNaN(parsedToDate.getTime()) ? null : parsedToDate.toISOString().split('T')[0]
}

export const parseMedicineToDataItem = (
  medicineList: MedicineTypeExtended[]
): MedicineTableDataItem[] =>
  medicineList.map(medItem => ({
    id: medItem.id ?? 0,
    name: medItem.name,
    laboratory: medItem.laboratory,
    presentation: medItem.medicinePresentation?.description ?? '',
    expirationDate: medItem.expirationDate
      ? medItem.expirationDate.toISOString().split('T')[0]
      : null,
    usedFor: medItem.usedFor,
    sideEffects: medItem.sideEffects,
    comments: medItem.comments
  }))
