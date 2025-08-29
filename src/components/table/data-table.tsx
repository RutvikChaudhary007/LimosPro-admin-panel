import {
 type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (updater: Record<string, boolean>) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowSelection,
  onRowSelectionChange,
  globalFilter,
  onGlobalFilterChange,
}: DataTableProps<TData, TValue>) {
     const [internalSelection, setInternalSelection] = useState({});

  const [internalFilter, setInternalFilter] = useState("");
  // console.log("globalFilter:",globalFilter)
  // console.log("internalFilter:",internalFilter)
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: onGlobalFilterChange ? getFilteredRowModel() : undefined,
    state: {
      rowSelection: rowSelection ?? internalSelection,
      globalFilter: globalFilter ?? internalFilter,
    },
    onRowSelectionChange: onRowSelectionChange ?? setInternalSelection,
    onGlobalFilterChange: onGlobalFilterChange ?? setInternalFilter,
    enableRowSelection: true,
  })

  return (
    <div className="mt-5 rounded-[6px] border border-[#F1F1F1] py-4 inset-shadow-xs inset-shadow-[#F1F1F1]  shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <Table className="min-w-full w-full">
        <TableHeader className="bg-[#F5F5F5] ">
          {table?.getHeaderGroups()?.map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead className="px-4" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="px-4" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 px-4 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}