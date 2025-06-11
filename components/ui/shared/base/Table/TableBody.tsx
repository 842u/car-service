import { useTable } from './Table';

export function TableBody() {
  const { table } = useTable();

  const rows = table.getRowModel().rows;
  const columns = table.getAllColumns();

  return (
    <tbody>
      {rows.map((row) => (
        <tr key={row.id}>
          {columns.map((column) => (
            <td key={column.id}>{row.getValue(column.id)}</td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
