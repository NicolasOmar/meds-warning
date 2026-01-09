'use client'
import { deleteMedicine } from '@actions/medicine'
import { Button } from '@base-components/button'
import DataTable from '@custom-components/DataTable'
import { MEDICINE_TABLE_LABELS } from '@shared-constants/labels'
import { ROUTES } from '@shared-constants/routes'
import Link from 'next/link'
import { FC, useMemo } from 'react'

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
  const memoizedMedicineList = useMemo(
    () =>
      medicineList.map(medicineItem => ({
        ...medicineItem,
        actions: (
          <>
            <Link href={`${ROUTES.MEDICINE_MAIN}/${medicineItem.id}`}>
              <Button variant="secondary">Edit</Button>
            </Link>
            <Button onClick={() => deleteMedicine(medicineItem.id)}>Delete</Button>
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
