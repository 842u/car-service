import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { useTable } from '../../use-table';

type TableRootProps = Omit<ComponentProps<'table'>, 'className'> & {
  /**
   * Applied to the scroll container wrapping the table, not to the table.
   * Pass a height cap; the overflow is already handled.
   */
  className?: string;
};

export function TableRoot({ className, children, ...props }: TableRootProps) {
  useTable();

  return (
    // Being a scroll container is also what lets the wrapper shrink: a flex or
    // grid item whose overflow is not visible has an automatic minimum size of
    // zero, so it escapes the min-content floor that `whitespace-nowrap` cells
    // would otherwise impose.
    <div className={twMerge('overflow-auto', className)}>
      <table className="w-full border-separate border-spacing-0" {...props}>
        {children}
      </table>
    </div>
  );
}
