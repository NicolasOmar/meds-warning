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
import CustomSelect from '@custom-components/CustomSelect'
import { DialogClose } from '@base-components/dialog'

interface MedicinePresentationTableProps {
  presentationList: MedicinePresentationType[]
}

const MedicinePresentationTable: FC<MedicinePresentationTableProps> = ({ presentationList }) => {
  const handleDeleteClick = async (id: number, replacement?: number) => {
    if (id && replacement !== undefined) {
      const response = await deletePresentation(id, replacement)
      if (response.message) {
        const toastAction = response.errors ? toast.error : toast.success

        toastAction(response.message)
      }
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
            {presentationList.length > 1 ? (
              <CustomDialog
                initButton={{
                  text: <TrashIcon />,
                  title: COMMON_LABELS.DELETE
                }}
                title={`${COMMON_LABELS.DELETE} '${presentationItem.description}'`}
                description={MEDICINE_PRESENTATION_TABLE_LABELS.DELETE_QUESTION}
                body={
                  <form
                    className="flex flex-col gap-4"
                    action={formData =>
                      handleDeleteClick(presentationItem.id!, Number(formData.get('replacement')))
                    }
                  >
                    <CustomSelect
                      label="Replace with:"
                      name="replacement"
                      selectLabel="Replace with:"
                      options={presentationList
                        .filter(item => item.id !== presentationItem.id)
                        .map(item => ({
                          label: item.description,
                          value: item.id!.toString()
                        }))}
                    />
                    <section className="flex justify-end">
                      <DialogClose className="flex gap-x-2">
                        <Button variant="outline" type="button">
                          {COMMON_LABELS.CANCEL}
                        </Button>
                        <Button
                          type="submit"
                          onClick={() => handleDeleteClick(presentationItem.id!)}
                        >
                          {COMMON_LABELS.CONFIRM}
                        </Button>
                      </DialogClose>
                    </section>
                  </form>
                }
              />
            ) : null}
          </section>
        )
      })),
    [presentationList]
  )

  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-sm border p-6">
      <DataTable
        title={MEDICINE_PRESENTATION_TABLE_LABELS.TITLE}
        headers={MEDICINE_PRESENTATION_TABLE_LABELS.HEADERS.split(',')}
        data={memoizedMedicineList}
      />
    </div>
  )
}

export default MedicinePresentationTable
