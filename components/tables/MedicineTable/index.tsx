'use client'
// CORE
import { FC, useMemo } from 'react'
import { deleteMedicine } from '@actions/medicine'
import Link from 'next/link'
// COMPONENTS
import { toast } from 'sonner'
import { Button } from '@base-components/button'
import DataTable from '@custom-components/DataTable'
// SHARED
import { MEDICINE_TABLE_LABELS } from '@shared-constants/labels'
import { ROUTES } from '@shared-constants/routes'

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

interface MedicineTableProps {
  medicineList: MedicineDataItem[]
}

const MedicineTable: FC<MedicineTableProps> = ({ medicineList }) => {
  const handleDeleteClick = async (id: number) => {
    const response = await deleteMedicine(id)
    if (response.message) {
      const toastAction = response.errors ? toast.error : toast.success

      toastAction(response.message)
    }
  }

  const memoizedMedicineList = useMemo(
    () =>
      medicineList.map(medicineItem => ({
        ...medicineItem,
        actions: (
          <>
            <Link href={`${ROUTES.MEDICINE_MAIN}/${medicineItem.id}`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Button onClick={() => handleDeleteClick(medicineItem.id)}>Delete</Button>
          </>
        )
      })),
    [medicineList]
  )

  return (
    <DataTable
      title={MEDICINE_TABLE_LABELS.TITLE}
      headers={MEDICINE_TABLE_LABELS.HEADERS.split(',')}
      data={memoizedMedicineList}
    />
  )
}

export default MedicineTable
