import { flexRender } from '@tanstack/react-table';

import { useTable } from './Table';

export function TableBody() {
  const { table } = useTable();

  const rows = table.getRowModel().rows;

  return (
    <tbody>
      {rows.map((row) => (
        <tr
          key={row.id}
          className="border-alpha-grey-200 text-dark-400 dark:text-light-600 border-b last-of-type:border-0"
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
