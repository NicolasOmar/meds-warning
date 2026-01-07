// COMPONENTS
import { FieldLabel } from '@base-components/field'
import {
  Table,
  TableBody,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@base-components/table'
// SHARED
import { COMMON_TABLE_ERRORS } from '@shared-constants/labels'

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
  return data.length > 0 ? (
    <>
      {title ? <FieldLabel>{title}</FieldLabel> : null}
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
        {/* <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">$2,500.00</TableCell>
          </TableRow>
        </TableFooter> */}
      </Table>
    </>
  ) : (
    <p>{noDataMessage}</p>
  )
}

export default DataTable
