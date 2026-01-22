'use client'
// CORE
import { FC, useMemo, useRef, useState } from 'react'
import { deleteMedicine, getMedicines } from '@actions/medicine'
import Link from 'next/link'
// COMPONENTS
import { toast } from 'sonner'
import { Button } from '@base-components/button'
import DataTable from '@custom-components/DataTable'
import CustomDialog from '@custom-components/CustomModal'
import CustomInput from '@custom-components/CustomInput'
// SHARED
import { COMMON_LABELS } from '@shared-constants/common'
import { MEDICINE_TABLE_LABELS } from '@shared-constants/tables'
import { ROUTES } from '@shared-constants/routes'
import { debounce } from '@shared-functions/debounce'
import { parseMedicineToDataItem } from '@shared-functions/parsers'

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
  const [medicines, setMedicines] = useState<MedicineDataItem[]>(medicineList)
  const [isWorking, setIsWorking] = useState<boolean>(false)

  // Create a persistent debounced search function using useRef
  const debouncedSearchRef = useRef(
    debounce(async (value: string) => {
      setIsWorking(true)
      try {
        const fetchedMedicineList = await getMedicines(value)
        setMedicines(parseMedicineToDataItem(fetchedMedicineList))
      } catch {
        // Handle error gracefully - user will see the current medicines list
        // In a production app, you might want to show an error toast here
      } finally {
        setIsWorking(false)
      }
    }, 300)
  )

  const handleDeleteClick = async (id: number) => {
    setIsWorking(true)
    const response = await deleteMedicine(id)
    setIsWorking(false)

    if (response.message) {
      const toastAction = response.errors ? toast.error : toast.success

      toastAction(response.message)
    }
  }

  const handleSearchChange = (value: string) => {
    debouncedSearchRef.current(value)
  }

  const memoizedMedicineList = useMemo(
    () =>
      medicines.map(medicineItem => ({
        ...medicineItem,
        actions: (
          <>
            <Link href={`${ROUTES.MEDICINE_MAIN}/${medicineItem.id}`}>
              <Button variant="secondary">{COMMON_LABELS.EDIT}</Button>
            </Link>
            <CustomDialog
              buttonText={COMMON_LABELS.DELETE}
              title={COMMON_LABELS.CONFIRM_DELETE}
              description={`Are you sure you want to delete the medicine "${medicineItem.name}"? This action cannot be undone.`}
              confirmText={COMMON_LABELS.DELETE}
              disableConfirm={isWorking}
              onConfirm={() => handleDeleteClick(medicineItem.id)}
              cancelText={COMMON_LABELS.CANCEL}
              disableCancel={isWorking}
            />
          </>
        )
      })),
    [medicines, isWorking]
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
