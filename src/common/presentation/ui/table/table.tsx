import type { ColumnDef, RowData, TableOptions } from '@tanstack/react-table';
import { useTable as useTanstackTable } from '@tanstack/react-table';
import type { ReactNode } from 'react';

import { TableBody } from './compounds/body/body';
import { TableDateFilter } from './compounds/date-filter/date-filter';
import { TableHead } from './compounds/head/head';
import { TableRoot } from './compounds/root/root';
import { TableSortBreadcrumb } from './compounds/sort-breadcrumb/sort-breadcrumb';
import { TableTextFilter } from './compounds/text-filter/text-filter';
import { TableValuesFilter } from './compounds/values-filter/values-filter';
import { features } from './features';
import type { AnyRowTable } from './use-table';
import { TableContext } from './use-table';

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
