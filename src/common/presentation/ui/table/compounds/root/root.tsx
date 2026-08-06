import type { ComponentProps, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { useTable } from '../../table';

type TableRootProps = ComponentProps<'table'> & {
  className?: string;
  children?: ReactNode;
};

export function TableRoot({ className, children, ...props }: TableRootProps) {
  useTable();

  return (
    // The wrapper is the table's scroll container, so callers pass only a
    // height cap. Being a scroll container is also what lets it shrink: a flex
    // or grid item whose overflow is not visible has an automatic minimum size
    // of zero, so it escapes the min-content floor that `whitespace-nowrap`
    // cells would otherwise impose.
    <div className={twMerge('overflow-auto', className)}>
      <table className="h-full w-full" {...props}>
        {children}
      </table>
    </div>
  );
}
