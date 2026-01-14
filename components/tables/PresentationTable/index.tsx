'use client'
// CORE
import { FC, useMemo } from 'react'
import Link from 'next/link'
// COMPONENTS
import DataTable from '@custom-components/DataTable'
// SHARED
import { MEDICINE_PRESENTATION_TABLE_LABELS } from '@shared-constants/tables'
import { MedicinePresentationType } from '@shared-types/zod'
import { Button } from '@base-components/button'
import { COMMON_LABELS } from '@shared-constants/common'
import { ROUTES } from '@shared-constants/routes'

interface MedicinePresentationTableProps {
  presentationList: MedicinePresentationType[]
}

const MedicinePresentationTable: FC<MedicinePresentationTableProps> = ({ presentationList }) => {
  const memoizedMedicineList = useMemo(
    () =>
      presentationList.map(presentationItem => ({
        id: presentationItem.id,
        description: presentationItem.description,
        actions: (
          <>
            <Link href={`${ROUTES.PRESENTATION_MAIN}/${presentationItem.id}`}>
              <Button variant="secondary">{COMMON_LABELS.EDIT}</Button>
            </Link>
          </>
        )
      })),
    [presentationList]
  )

  return (
    <DataTable
      title={MEDICINE_PRESENTATION_TABLE_LABELS.TITLE}
      headers={MEDICINE_PRESENTATION_TABLE_LABELS.HEADERS.split(',')}
      data={memoizedMedicineList}
    />
  )
}

export default MedicinePresentationTable
