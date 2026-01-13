import DataTable from '@custom-components/DataTable'
import { MedicinePresentationType } from '@shared-types/zod'
import { FC } from 'react'

interface MedicinePresentationTableProps {
  presentationList: MedicinePresentationType[]
}

const MedicinePresentationTable: FC<MedicinePresentationTableProps> = ({ presentationList }) => {
  const presentationTitle = 'Medicine Presentations'
  const presentationHeaders = 'ID,Description'

  return (
    <DataTable
      title={presentationTitle}
      headers={presentationHeaders.split(',')}
      data={presentationList}
    />
  )
}

export default MedicinePresentationTable
