import type {
  ColumnDef,
  Table as TanstackTable,
  TableOptions,
} from '@tanstack/react-table';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ReactNode } from 'react';
import { createContext } from 'react';

import { useContextGuard } from '@/common/presentation/hook/use-context-guard';

import { TableBody } from './compounds/body/body';
import { TableDateFilter } from './compounds/date-filter/date-filter';
import { TableHead } from './compounds/head/head';
import { TableRoot } from './compounds/root/root';
import { TableSortBreadcrumb } from './compounds/sort-breadcrumb/sort-breadcrumb';
import { TableTextFilter } from './compounds/text-filter/text-filter';
import { TableValuesFilter } from './compounds/values-filter/values-filter';

type TableContextValue<TData> = {
  table: TanstackTable<TData>;
};

// eslint-disable-next-line
const TableContext = createContext<TableContextValue<any> | null>(null);

export function useTable() {
  return useContextGuard({
    context: TableContext,
    componentName: 'Table',
  });
}

type TableProps<TData> = {
  columns: ColumnDef<TData>[];
  data: TData[];
  options?: Partial<TableOptions<TData>>;
  children?: ReactNode;
};

export function Table<TData>({
  columns,
  data,
  options,
  children,
}: TableProps<TData>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    ...options,
  });

  return <TableContext value={{ table }}>{children}</TableContext>;
}

Table.Root = TableRoot;
Table.Head = TableHead;
Table.Body = TableBody;
Table.SortBreadcrumb = TableSortBreadcrumb;
Table.DateFilter = TableDateFilter;
Table.ValuesFilter = TableValuesFilter;
Table.TextFilter = TableTextFilter;
