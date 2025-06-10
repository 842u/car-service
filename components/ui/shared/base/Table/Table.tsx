import {
  ColumnDef,
  getCoreRowModel,
  Table as TanstackTable,
  TableOptions,
  useReactTable,
} from '@tanstack/react-table';
import { createContext, use } from 'react';

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
  options?: TableOptions<T>;
  className?: string;
};

export function Table<T>({ columns, data, options, className }: TableProps<T>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    ...options,
  });

  return (
    <TableContext value={{ table }}>
      <div className={className}>
        <table className="h-full w-full">
          <TableHead />
        </table>
      </div>
    </TableContext>
  );
}
