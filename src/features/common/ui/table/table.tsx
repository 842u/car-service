import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  Table as TanstackTable,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';
import { createContext, ReactNode } from 'react';

import { useContextGuard } from '@/common/hooks/use-context-guard';

import { TableBody } from './compounds/body/body';
import { TableDateFilter } from './compounds/date-filter/date-filter';
import { TableHead } from './compounds/head/head';
import { TableRoot } from './compounds/root/root';
import { TableSortBreadcrumb } from './compounds/sort-breadcrumb/sort-breadcrumb';
import { TableTextFilter } from './compounds/text-filter/text-filter';
import { ValuesFilter } from './compounds/values-filter/values-filter';

type TableContextValue<T> = { table: TanstackTable<T> };

// eslint-disable-next-line
const TableContext = createContext<TableContextValue<any> | null>(null);

export function useTable() {
  return useContextGuard({
    context: TableContext,
    componentName: 'Table',
  });
}

type TableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  options?: Partial<TableOptions<T>>;
  children?: ReactNode;
};

export function Table<T>({ columns, data, options, children }: TableProps<T>) {
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
Table.ValuesFilter = ValuesFilter;
Table.TextFilter = TableTextFilter;
