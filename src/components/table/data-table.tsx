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
  const table = useReactTable({
    data,
    columns,
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
    getRowId: (row: TData) => (row as any).id || "",
  });

  useEffect(() => {
    if (onTableReady) onTableReady(table);
  }, [table, onTableReady]);

  // Force re-render when rowSelection changes - include rowSelection in dependency
  const headerGroups = table?.getHeaderGroups();

  // Trigger re-render when selection state changes
  const selectedCount = rowSelection
    ? Object.values(rowSelection).filter(Boolean).length
    : 0;

  // Memoize rows to ensure they re-render when rowSelection changes
  const rows = table?.getRowModel()?.rows || [];

  return (
    <div className="rounded border border-base-light-gray shadow-base-md overflow-auto">
      {/* Hidden element to trigger re-render when selection changes */}
      <div style={{ display: "none" }}>{selectedCount}</div>
      <Table>
        <TableHeader className="bg-base-light-gray">
          {headerGroups?.map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan}>
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
          {rows?.length > 0 ? (
            rows?.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row?.getIsSelected() && "selected"}
                >
                  {row?.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
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
