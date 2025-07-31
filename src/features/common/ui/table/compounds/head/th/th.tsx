import { Header } from '@tanstack/react-table';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { useTable } from '@/ui/table/table';

import { ThDropdown } from './dropdown/dropdown';

type HeadThProps = ComponentProps<'th'> & {
  // eslint-disable-next-line
  header: Header<any, unknown>;
};

export function HeadTh({ header, ...props }: HeadThProps) {
  useTable();

  const column = header.column;
  const headerLabel = column.columnDef.meta?.label;
  const isSortable = column.columnDef.enableSorting;
  const columnId = column.id;
  const shouldSpan = column.columnDef.meta?.shouldSpan;

  return (
    <th
      className={twMerge(
        'w-1 px-5 py-1 text-start whitespace-nowrap',
        shouldSpan ? 'w-auto' : '',
      )}
      {...props}
    >
      {isSortable ? (
        <ThDropdown columnId={columnId} label={headerLabel} />
      ) : (
        headerLabel
      )}
    </th>
  );
}
