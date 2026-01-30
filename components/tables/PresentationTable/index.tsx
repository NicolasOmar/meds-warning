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
import { ROUTE_URLS } from '@shared-constants/routes'
import { PencilIcon, TrashIcon } from 'lucide-react'

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
          <section className="flex gap-2">
            <Link href={`${ROUTE_URLS.PRESENTATION_ROOT}/${presentationItem.id}`}>
              <Button variant="secondary" title={COMMON_LABELS.EDIT}>
                <PencilIcon />
              </Button>
            </Link>
            <CustomDialog
              initButton={{
                text: <TrashIcon />,
                title: COMMON_LABELS.DELETE
              }}
              title={`${COMMON_LABELS.DELETE} '${presentationItem.description}'`}
              description={MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_QUESTION}
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
          </section>
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
