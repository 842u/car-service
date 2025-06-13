import { ReactNode } from 'react';

import { useTable } from './Table';

type TableRootProps = {
  className?: string;
  children?: ReactNode;
};

export function TableRoot({ className, children }: TableRootProps) {
  useTable();

  return (
    <div className={className}>
      <table className="h-full w-full">{children}</table>
    </div>
  );
}
