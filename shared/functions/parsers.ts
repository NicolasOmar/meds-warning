import { MedicineTypeExtended } from '@shared-types/zod'

interface MedicineDataItem {
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

export const parseMedicineToDataItem = (medicineList: MedicineTypeExtended[]): MedicineDataItem[] =>
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
