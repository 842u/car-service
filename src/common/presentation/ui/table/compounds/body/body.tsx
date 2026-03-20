import { flexRender } from '@tanstack/react-table';
import type { RefObject } from 'react';

import { useTable } from '../../table';

interface TableBodyProps {
  lastRowRef?: RefObject<HTMLTableRowElement | null>;
}

export function TableBody({ lastRowRef }: TableBodyProps) {
  const { table } = useTable();

  const rows = table.getRowModel().rows;

  return (
    <tbody>
      {rows.map((row, index) => (
        <tr
          key={row.id}
          ref={index === rows.length - 1 ? lastRowRef : null}
          className="border-alpha-grey-200 text-dark-400 dark:text-light-600 hover:bg-alpha-grey-100 border-b last-of-type:border-0"
        >
          {row.getVisibleCells().map((cell) => {
            return (
              <td key={cell.id} className="px-5 py-1 whitespace-nowrap">
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
