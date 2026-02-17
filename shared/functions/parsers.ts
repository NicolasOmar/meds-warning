import { format } from 'date-fns'
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

/**
 * Converts a UTC ISO string to a display-formatted date string using the UTC calendar day,
 * preventing the off-by-one issue for users in negative UTC offsets.
 */
export const formatUTCISODateForDisplay = (isoString: string): string => {
  const d = new Date(isoString)
  const utcDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  return format(utcDate, 'MMM d, yyyy')
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
    expirationDate: medItem.expirationDate ? medItem.expirationDate.toISOString() : null,
    usedFor: medItem.usedFor,
    sideEffects: medItem.sideEffects,
    comments: medItem.comments
  }))
