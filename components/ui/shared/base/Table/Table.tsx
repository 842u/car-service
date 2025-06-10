import {
  ColumnDef,
  getCoreRowModel,
  Table as TanstackTable,
  useReactTable,
} from '@tanstack/react-table';
import { createContext, ReactNode, use } from 'react';

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
  children: ReactNode;
  className?: string;
};

export function Table<T>({
  columns,
  data,
  children,
  className,
}: TableProps<T>) {
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <TableContext value={{ table }}>
      <div className={className}>
        <table className="h-full w-full">{children}</table>
      </div>
    </TableContext>
  );
}
