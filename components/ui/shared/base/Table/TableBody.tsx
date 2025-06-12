import { flexRender } from '@tanstack/react-table';

import { useTable } from './Table';

export function TableBody() {
  const { table } = useTable();

  const rows = table.getRowModel().rows;

  return (
    <tbody>
      {rows.map((row) => (
        <tr key={row.id}>
          {row.getVisibleCells().map((cell) => {
            return (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            );
          })}
        </tr>
      ))}
    </tbody>
  );
}
