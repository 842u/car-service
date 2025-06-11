import { Header } from '@tanstack/react-table';
import { ComponentProps } from 'react';

import { useTable } from './Table';

type TableThProps = ComponentProps<'th'> & {
  // eslint-disable-next-line
  header: Header<any, unknown>;
};

export function TableTh({ header, ...props }: TableThProps) {
  useTable();

  const headerLabel = header.column.columnDef.meta?.label;
  const isSortable = header.column.columnDef.enableSorting;

  return (
    <th className="text-start" {...props}>
      {isSortable ? `${headerLabel} sortable` : headerLabel}
    </th>
  );
}
