import { flexRender } from '@tanstack/react-table';
import type { RefObject } from 'react';

import { SearchIcon } from '@/icons/search';
import { EmptyStatePlaceholder } from '@/ui/empty-state-placeholder/empty-state-placeholder';

import { useTable } from '../../table';

interface TableBodyProps {
  lastRowRef?: RefObject<HTMLTableRowElement | null>;
}

export function TableBody({ lastRowRef }: TableBodyProps) {
  const { table } = useTable();

  const rows = table.getRowModel().rows;
  const columnCount = table.getVisibleLeafColumns().length;

  if (rows.length === 0) {
    return (
      <tbody>
        <tr>
          <td colSpan={columnCount}>
            <EmptyStatePlaceholder
              icon={SearchIcon}
              subtext="No data matches your current filters or sorting. Try broadening your search."
              text="No matching results"
            />
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {rows.map((row, index) => (
        <tr
          key={row.id}
          ref={index === rows.length - 1 ? lastRowRef : null}
          className="border-alpha-grey-200 text-dark-400 dark:text-light-600 hover:bg-alpha-grey-100 border-b last-of-type:border-0"
        >
          {row.getVisibleCells().map((cell) => (
            <td key={cell.id} className="px-5 py-1 whitespace-nowrap">
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
