import { ComponentProps, ReactNode } from 'react';

import { useTable } from './table';

type RootProps = ComponentProps<'table'> & {
  className?: string;
  children?: ReactNode;
};

export function Root({ className, children, ...props }: RootProps) {
  useTable();

  return (
    <div className={className}>
      <table className="h-full w-full" {...props}>
        {children}
      </table>
    </div>
  );
}
