import type { Header } from '@tanstack/react-table';
import type { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { TableDateFilter } from '@/ui/table/compounds/date-filter/date-filter';
import { TableTextFilter } from '@/ui/table/compounds/text-filter/text-filter';
import { TableValuesFilter } from '@/ui/table/compounds/values-filter/values-filter';
import { useTable } from '@/ui/table/table';

import { TableSortDropdown } from '../../sort-dropdown/sort-dropdown';

interface HeadThProps extends ComponentProps<'th'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  header: Header<any, unknown>;
}

export function HeadTh({ header, ...props }: HeadThProps) {
  useTable();

  const column = header.column;
  const columnId = column.id;
  const meta = column.columnDef.meta;
  const headerLabel = meta?.label;
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
      {isSortable && (
        <TableSortDropdown columnId={columnId} label={headerLabel} />
      )}

      {filter?.type === 'text' && <TableTextFilter columnId={columnId} />}

      {filter?.type === 'date' && <TableDateFilter columnId={columnId} />}

      {filter?.type === 'values' && (
        <TableValuesFilter
          checkboxLabelValueMapping={filter.valuesMapping}
          columnId={columnId}
          showLabel={false}
        />
      )}
    </th>
  );
}
