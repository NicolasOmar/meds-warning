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
import { COMMON_LABELS } from '@shared-constants/common'
import { MEDICINE_TABLE_LABELS } from '@shared-constants/tables'
import { ROUTES } from '@shared-constants/routes'
import CustomDialog from '@custom-components/CustomModal'

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
            <CustomDialog
              buttonText={COMMON_LABELS.DELETE}
              title={COMMON_LABELS.CONFIRM_DELETE}
              description={`Are you sure you want to delete the medicine "${medicineItem.name}"? This action cannot be undone.`}
              confirmText={COMMON_LABELS.DELETE}
              onConfirm={() => handleDeleteClick(medicineItem.id)}
              cancelText={COMMON_LABELS.CANCEL}
            />
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
