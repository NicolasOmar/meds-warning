// CORE
import { FC } from 'react'
// COMPONENTS
import DataTable from '@custom-components/DataTable'
// SHARED
import { MEDICINE_PRESENTATION_TABLE_LABELS } from '@shared-constants/tables'
import { MedicinePresentationType } from '@shared-types/zod'

interface MedicinePresentationTableProps {
  presentationList: MedicinePresentationType[]
}

const MedicinePresentationTable: FC<MedicinePresentationTableProps> = ({ presentationList }) => {
  return (
    <DataTable
      title={MEDICINE_PRESENTATION_TABLE_LABELS.TITLE}
      headers={MEDICINE_PRESENTATION_TABLE_LABELS.HEADERS.split(',')}
      data={presentationList}
    />
  )
}

export default MedicinePresentationTable
