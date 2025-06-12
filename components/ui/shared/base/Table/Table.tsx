import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  Table as TanstackTable,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';
import { createContext, ReactNode, use } from 'react';

import { TableBody } from './TableBody';
import { TableHead } from './TableHead';

type TableContextValue<T> = { table: TanstackTable<T> };

// eslint-disable-next-line
const TableContext = createContext<TableContextValue<any> | null>(null);

export function useTable() {
  const context = use(TableContext);

  if (!context)
    throw new Error('Table related components should be wrapped in <Table>.');

  return context;
}

type TableProps<T> = {
  columns: ColumnDef<T>[];
  data: T[];
  options?: Partial<TableOptions<T>>;
  className?: string;
  children?: ReactNode;
};

export function Table<T>({
  columns,
  data,
  options,
  className,
  children,
}: TableProps<T>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...options,
  });

  return (
    <TableContext value={{ table }}>
      <div className={className}>
        <table className="h-full w-full">{children}</table>
      </div>
    </TableContext>
  );
}

Table.Head = TableHead;
Table.Body = TableBody;
