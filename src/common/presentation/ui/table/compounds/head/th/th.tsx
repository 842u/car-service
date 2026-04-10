import type { Header } from '@tanstack/react-table';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { TableColumnDropdown } from '@/ui/table/compounds/column-dropdown/column-dropdown';
import { useTable } from '@/ui/table/table';

interface HeadThProps extends ComponentProps<'th'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  header: Header<any, unknown>;
}

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
        'w-1 px-5 py-1 text-start whitespace-nowrap',
        shouldSpan ? 'w-auto' : '',
      )}
      {...props}
    >
      {isSortable || filter ? (
        <TableColumnDropdown
          columnId={columnId}
          isSortable={isSortable}
          label={meta?.label}
        />
      ) : (
        meta?.label
      )}
    </th>
  );
}
