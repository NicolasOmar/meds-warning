'use client'
// CORE
import { FC, useActionState, useEffect, useMemo, useRef, useState } from 'react'
import { deleteMedicine, getMedicines, handleExpirationDateAction } from '@actions/medicine'
import Link from 'next/link'
// COMPONENTS
import { toast } from 'sonner'
import { Button } from '@base-components/button'
import { DialogClose } from '@base-components/dialog'
import DataTable from '@custom-components/DataTable'
import CustomDialog from '@custom-components/CustomModal'
import CustomInput from '@custom-components/CustomInput'
import DatePicker from '@custom-components/DatePicker'
// SHARED
import { ExpirationDateActionState } from '@shared-types/states'
import { COMMON_LABELS } from '@shared-constants/common'
import { MEDICINE_TABLE_LABELS } from '@shared-constants/tables'
import { ROUTES } from '@shared-constants/routes'
import { debounce } from '@shared-functions/helpers'
import { parseMedicineToDataItem } from '@shared-functions/parsers'
import { handleCommonFormState } from '@shared-functions/forms'
import { CalendarSyncIcon, PencilIcon, TrashIcon } from 'lucide-react'

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
  const [state, expirationDateFormAction, isExpirationDatePending] = useActionState<
    ExpirationDateActionState,
    FormData
  >(handleExpirationDateAction, {})
  const [medicines, setMedicines] = useState<MedicineDataItem[]>(medicineList)
  const [isWorking, setIsWorking] = useState<boolean>(false)
  const debouncedSearchRef = useRef(
    debounce(async (value: string) => {
      try {
        setIsWorking(true)
        const fetchedMedicineList = await getMedicines(value)
        setMedicines(parseMedicineToDataItem(fetchedMedicineList))
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred while searching medicines.'
        )
      } finally {
        setIsWorking(false)
      }
    }, 300)
  )

  useEffect(() => {
    handleCommonFormState(ROUTES.MEDICINE_LIST, state)
  }, [state])

  const handleDeleteClick = async (id: number) => {
    setIsWorking(true)
    const response = await deleteMedicine(id)
    setIsWorking(false)

    if (response.message) {
      const toastAction = response.errors ? toast.error : toast.success

      toastAction(response.message)
    }
  }

  // const handleExpirationDateChange = (event: React.FormEvent<HTMLFormElement>, medicineId: number, originalDate: string) => {
  //   event.preventDefault()
  //   event.stopPropagation()

  //   const formElements = event.currentTarget.elements as HTMLCollection
  //   const dateInput = formElements.namedItem('expirationDate') as HTMLInputElement
  //   const newDate = parseStringDateToISOString(dateInput.value)

  //   if (newDate === originalDate) {
  //     toast.error('The new expiration date must be different from the original date.')
  //     return
  //   }
  //   console.log({
  //     medicineId,
  //     dateInput: parseStringDateToISOString(dateInput.value),
  //     originalDate
  //   })
  // }

  const handleSearchChange = (value: string) => {
    debouncedSearchRef.current(value)
  }

  const memoizedMedicineList = useMemo(
    () =>
      medicines.map(medicineItem => ({
        ...medicineItem,
        actions: (
          <section className="flex gap-2">
            <Link href={`${ROUTES.MEDICINE_MAIN}/${medicineItem.id}`}>
              <Button variant="secondary" title={COMMON_LABELS.EDIT}>
                <PencilIcon />
              </Button>
            </Link>
            <CustomDialog
              initButton={{
                text: <TrashIcon />,
                disabled: isWorking,
                title: COMMON_LABELS.DELETE
              }}
              title={`${COMMON_LABELS.DELETE} '${medicineItem.name}'`}
              description={MEDICINE_TABLE_LABELS.DELETE_QUESTION}
              confirmButton={{
                text: COMMON_LABELS.DELETE,
                type: 'button',
                disabled: isWorking,
                onClick: () => handleDeleteClick(medicineItem.id)
              }}
              cancelButton={{
                text: COMMON_LABELS.CANCEL,
                type: 'button',
                disabled: isWorking
              }}
            />
            <CustomDialog
              initButton={{
                text: <CalendarSyncIcon />,
                disabled: isWorking,
                title: MEDICINE_TABLE_LABELS.EDIT_EXPIRATION_DATE_LABEL
              }}
              title={MEDICINE_TABLE_LABELS.EDIT_EXPIRATION_DATE_LABEL}
              body={
                <form className="flex flex-col gap-4" action={expirationDateFormAction}>
                  <input type="hidden" name="medicineId" value={medicineItem.id} />
                  <DatePicker
                    name="expirationDate"
                    label={MEDICINE_TABLE_LABELS.NEW_EXPIRATION_DATE_LABEL}
                    value={medicineItem.expirationDate ?? undefined}
                  />
                  <section className="flex justify-end">
                    <DialogClose className="flex gap-x-2">
                      <Button
                        variant="outline"
                        disabled={isWorking || isExpirationDatePending}
                        type="button"
                      >
                        {COMMON_LABELS.CANCEL}
                      </Button>
                      <Button type="submit" disabled={isWorking || isExpirationDatePending}>
                        {COMMON_LABELS.CONFIRM}
                      </Button>
                    </DialogClose>
                  </section>
                </form>
              }
            />
          </section>
        )
      })),
    [medicines, isWorking, expirationDateFormAction, isExpirationDatePending]
  )

  return (
    <>
      <CustomInput
        type="search"
        name="searchMedicine"
        placeholder={MEDICINE_TABLE_LABELS.SEARCH_PLACEHOLDER}
        onChange={event => handleSearchChange(event.target.value)}
      />
      <DataTable
        title={MEDICINE_TABLE_LABELS.TITLE}
        headers={MEDICINE_TABLE_LABELS.HEADERS.split(',')}
        data={memoizedMedicineList}
      />
    </>
  )
}

export default MedicineTable
