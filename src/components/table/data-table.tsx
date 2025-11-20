// @ts-nocheck

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  type Table as TanstackTable,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowSelection?: Record<string, boolean>;
  onRowSelectionChange?: (updater: Record<string, boolean>) => void;
  globalFilter?: string;
  onGlobalFilterChange?: (value: string) => void;
  onTableReady?: (table: TanstackTable<TData>) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowSelection,
  onRowSelectionChange,
  globalFilter,
  onGlobalFilterChange,
  onTableReady,
}: DataTableProps<TData, TValue>) {
  const safeData = Array.isArray(data) ? data : [];
  const safeColumns = Array.isArray(columns) ? columns : [];
  const table = useReactTable({
    data: safeData,
    columns: safeColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: onGlobalFilterChange
      ? getFilteredRowModel()
      : undefined,
    state: {
      rowSelection: rowSelection,
      globalFilter: globalFilter,
    },
    onRowSelectionChange: onRowSelectionChange,
    onGlobalFilterChange: onGlobalFilterChange,
    enableRowSelection: true,
    enableMultiRowSelection: true,
  });

  useEffect(() => {
    if (onTableReady) onTableReady(table);
  }, [table, onTableReady]);
  return (
    <div className="rounded border border-base-light-gray shadow-base-md overflow-auto">
      <Table>
        <TableHeader className="bg-base-light-gray">
          {table?.getHeaderGroups()?.map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // console.log("header:",header)
                return (
                  <TableHead
                    className="py-4 font-montserrat font-semibold text-lg text-base-black leading-[100%] tracking-normal"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
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
                  <TableCell
                    className="font-quicksand font-medium text-[16px] text-base-black leading-[100%] tracking-normal"
                    key={cell.id}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
