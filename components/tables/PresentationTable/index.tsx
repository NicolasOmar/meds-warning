'use client'
// CORE
import { FC, useMemo } from 'react'
import Link from 'next/link'
// ACTIONS
import { deletePresentation } from '@actions/presentation'
// COMPONENTS
import { toast } from 'sonner'
import DataTable from '@custom-components/DataTable'
import CustomDialog from '@custom-components/CustomModal'
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
  const handleDeleteClick = async (id: number) => {
    const response = await deletePresentation(id)
    if (response.message) {
      const toastAction = response.errors ? toast.error : toast.success

      toastAction(response.message)
    }
  }

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
            <CustomDialog
              buttonText={COMMON_LABELS.DELETE}
              title={COMMON_LABELS.CONFIRM_DELETE}
              description={`Are you sure you want to delete the medicine presentation "${presentationItem.description}"? This action cannot be undone.`}
              confirmButton={{
                text: COMMON_LABELS.DELETE,
                type: 'button',
                onClick: () => handleDeleteClick(presentationItem.id!)
              }}
              cancelButton={{
                text: COMMON_LABELS.CANCEL,
                type: 'button'
              }}
            />
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
