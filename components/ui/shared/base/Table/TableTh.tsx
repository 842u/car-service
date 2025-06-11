import { Header } from '@tanstack/react-table';
import { ComponentProps } from 'react';

import { useTable } from './Table';
import { TableThDropdown } from './TableThDropdown';

type TableThProps = ComponentProps<'th'> & {
  // eslint-disable-next-line
  header: Header<any, unknown>;
};

export function TableTh({ header, ...props }: TableThProps) {
  useTable();

  const headerLabel = header.column.columnDef.meta?.label;
  const isSortable = header.column.columnDef.enableSorting;
  const columnId = header.column.id;

  return (
    <th className="text-start" {...props}>
      {isSortable ? (
        <TableThDropdown columnId={columnId} label={headerLabel} />
      ) : (
        <span className="px-1">{headerLabel}</span>
      )}
    </th>
  );
}
