'use client';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/tailwind-utils';
import {
  CellContext,
  ColumnDef,
  HeaderContext,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import React, { useState } from 'react';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    cell?: (props: CellContext<TData, TValue>) => React.ReactNode;
    header?: (props: HeaderContext<TData, TValue>) => React.ReactNode;
  }
}

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  idFieldName?: string;
  isFixedTable?: boolean;
  isLoading?: boolean;
  linkPathname?: string;
  tableBodyAdditionalChildren?: React.ReactNode;
  noDataText?: string;
};

export default function DataTable<TData, TValue>({
  columns,
  data,
  idFieldName = 'id',
  isFixedTable = false,
  isLoading = false,
  linkPathname,
  tableBodyAdditionalChildren,
  noDataText,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId: (row, index) => {
      const rowWithPossibleId: { [id: string]: string } = row as unknown as {
        [id: string]: string;
      };

      return rowWithPossibleId?.[idFieldName] ?? index.toString();
    },
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      pagination,
      sorting,
    },
  });

  const hasAdditionalPages =
    table.getCanPreviousPage() || table.getCanNextPage();

  const tableBody = isLoading ? (
    <TableRow className="hover:!bg-transparent">
      <TableCell colSpan={columns.length} className="h-24">
        <div className="flex flex-col gap-1 w-full">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </TableCell>
    </TableRow>
  ) : (
    <>
      {table.getRowModel().rows?.length ? (
        table.getRowModel().rows.map((row) => (
          <TableRow
            key={row.id}
            data-state={row.getIsSelected() && 'selected'}
            className="h-[50px]"
          >
            {row.getVisibleCells().map((cell) => {
              // allow for custom cell rendering
              if (cell.column.columnDef.meta?.cell) {
                return (
                  <React.Fragment key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.meta.cell,
                      cell.getContext(),
                    )}
                  </React.Fragment>
                );
              }

              return (
                <React.Fragment key={cell.id}>
                  {linkPathname ? (
                    <TableCell className="p-0 contents">
                      <Link
                        href={`${linkPathname}/${row.id}`}
                        className="table-cell align-middle p-2"
                      >
                        <>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </>
                      </Link>
                    </TableCell>
                  ) : (
                    <TableCell>
                      <>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </>
                    </TableCell>
                  )}
                </React.Fragment>
              );
            })}
          </TableRow>
        ))
      ) : (
        <>
          {noDataText && (
            <TableRow className="hover:!bg-transparent">
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {noDataText}
              </TableCell>
            </TableRow>
          )}
        </>
      )}
    </>
  );

  return (
    <>
      <Table className={cn(isFixedTable && 'table-fixed')}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                // allow for custom header rendering
                if (header.column.columnDef.meta?.header) {
                  return (
                    <React.Fragment key={header.id}>
                      {flexRender(
                        header.column.columnDef.meta.header,
                        header.getContext(),
                      )}
                    </React.Fragment>
                  );
                }

                return (
                  <TableHead key={header.id}>
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
          <>{tableBody}</>
          {tableBodyAdditionalChildren && <>{tableBodyAdditionalChildren}</>}
        </TableBody>
      </Table>
      {!isLoading && hasAdditionalPages && (
        <div className="mt-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => table.previousPage()}
                  isDisabled={!table.getCanPreviousPage()}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() => table.nextPage()}
                  isDisabled={!table.getCanNextPage()}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
}
