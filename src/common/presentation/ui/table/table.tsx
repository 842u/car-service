import type {
  ColumnDef,
  ReactTable,
  RowData,
  TableOptions,
} from '@tanstack/react-table';
import { useTable as useTanstackTable } from '@tanstack/react-table';
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
import { features } from './features';

// The compound components read the table without knowing the row shape, so
// the context erases it. v9's table type is invariant in its data parameter,
// which is why a concrete instance needs the cast below to reach the context.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRowTable = ReactTable<typeof features, any>;

type TableContextValue = {
  table: AnyRowTable;
};

const TableContext = createContext<TableContextValue | null>(null);

export function useTable() {
  return useContextGuard({
    context: TableContext,
    componentName: 'Table',
  });
}

type TableProps<TData extends RowData> = {
  columns: ColumnDef<typeof features, TData>[];
  data: TData[];
  options?: Partial<TableOptions<typeof features, TData>>;
  children?: ReactNode;
};

export function Table<TData extends RowData>({
  columns,
  data,
  options,
  children,
}: TableProps<TData>) {
  const table = useTanstackTable({
    features,
    columns,
    data,
    ...options,
  });

  return (
    <TableContext value={{ table: table as AnyRowTable }}>
      {children}
    </TableContext>
  );
}

Table.Root = TableRoot;
Table.Head = TableHead;
Table.Body = TableBody;
Table.SortBreadcrumb = TableSortBreadcrumb;
Table.DateFilter = TableDateFilter;
Table.ValuesFilter = TableValuesFilter;
Table.TextFilter = TableTextFilter;
