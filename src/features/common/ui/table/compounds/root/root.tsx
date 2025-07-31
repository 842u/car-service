import { ComponentProps, ReactNode } from 'react';

import { useTable } from '../../table';

type TableRootProps = ComponentProps<'table'> & {
  className?: string;
  children?: ReactNode;
};

export function TableRoot({ className, children, ...props }: TableRootProps) {
  useTable();

  return (
    <div className={className}>
      <table className="h-full w-full" {...props}>
        {children}
      </table>
    </div>
  );
}
