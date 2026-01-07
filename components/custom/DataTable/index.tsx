// COMPONENTS
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  // TableFooter,
  TableHead,
  TableHeader,
  TableRow
} from '@base-components/table'

interface DataTableProps<T extends object> {
  caption?: string
  headers: string[]
  data: T[]
}

const DataTable = <T extends object>({ caption, headers, data }: DataTableProps<T>) => {
  return (
    <Table>
      {caption ? <TableCaption>{caption}</TableCaption> : null}
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
  )
}

export default DataTable
