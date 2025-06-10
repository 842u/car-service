import { createContext, ReactNode, use } from 'react';

type TableContextValue = { context: boolean };

const TableContext = createContext<TableContextValue | null>(null);

export function useTable() {
  const context = use(TableContext);

  if (!context)
    throw new Error('Table related components should be wrapped in <Table>.');

  return context;
}

type TableProps = {
  children: ReactNode;
  className?: string;
};

export function Table({ children, className }: TableProps) {
  return (
    <TableContext value={{ context: true }}>
      <div className={className}>
        <table className="h-full w-full">{children}</table>
      </div>
    </TableContext>
  );
}
