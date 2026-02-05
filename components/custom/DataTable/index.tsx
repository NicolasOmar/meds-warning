// COMPONENTS
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@base-components/table'
// SHARED
import { COMMON_TABLE_ERRORS } from '@shared-constants/common'

interface DataTableProps<T extends object> {
  title?: string
  headers: string[]
  data: T[]
  noDataMessage?: string
}

const DataTable = <T extends object>({
  title,
  headers,
  data,
  noDataMessage = COMMON_TABLE_ERRORS.NO_DATA
}: DataTableProps<T>) => {
  return (
    <>
      {title ? <h2 className="text-sm font-semibold mb-3">{title}</h2> : null}
      {data.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead key={`table-header-${index}`}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((dataSingleItem, index) => (
              <TableRow key={`table-row-${index}`}>
                {Object.values(dataSingleItem).map((itemValue, cellIndex) => (
                  <TableCell key={`table-cell-${index}-${cellIndex}`}>
                    {itemValue === null ? '-' : (itemValue as string)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="text-muted-foreground text-sm py-8 text-center">{noDataMessage}</p>
      )}
    </>
  )
}

export default DataTable
