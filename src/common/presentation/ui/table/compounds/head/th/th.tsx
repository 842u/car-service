import type { Header } from '@tanstack/react-table';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { TableColumnDropdown } from '@/ui/table/compounds/column-dropdown/column-dropdown';
import { useTable } from '@/ui/table/table';

type HeadThProps = ComponentProps<'th'> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  header: Header<any, unknown>;
};

export function HeadTh({ header, ...props }: HeadThProps) {
  useTable();

  const column = header.column;
  const columnId = column.id;
  const meta = column.columnDef.meta;
  const isSortable = column.columnDef.enableSorting;
  const shouldSpan = meta?.shouldSpan;
  const filter = meta?.filter;

  return (
    <th
      className={twMerge(
        'bg-light-600 dark:bg-dark-500 w-1 px-5 py-1 text-start whitespace-nowrap first:rounded-l-md last:rounded-r-md',
        shouldSpan ? 'w-auto' : '',
      )}
      {...props}
    >
      {isSortable || filter ? (
        <TableColumnDropdown columnId={columnId} label={meta?.label} />
      ) : (
        meta?.label
      )}
    </th>
  );
}
