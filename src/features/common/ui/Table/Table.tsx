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

import { useContextGuard } from '@/features/common/hooks/use-context-guard';

import { TableBody } from './body';
import { TableFilterDate } from './filter-date';
import { TableFilterText } from './filter-text';
import { TableFilterValues } from './filter-values';
import { TableHead } from './head';
import { TableRoot } from './root';
import { TableSortBreadcrumb } from './sort-breadcrumb';

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
Table.FilterDate = TableFilterDate;
Table.FilterValues = TableFilterValues;
Table.FilterText = TableFilterText;
