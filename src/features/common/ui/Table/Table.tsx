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

import { Body } from './body';
import { DateFilter } from './date-filter';
import { Head } from './head';
import { Root } from './root';
import { SortBreadcrumb } from './sort-breadcrumb';
import { TextFilter } from './text-filter';
import { ValuesFilter } from './values-filter';

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

Table.Root = Root;
Table.Head = Head;
Table.Body = Body;
Table.SortBreadcrumb = SortBreadcrumb;
Table.DateFilter = DateFilter;
Table.ValuesFilter = ValuesFilter;
Table.TextFilter = TextFilter;
