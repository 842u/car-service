import { useTable } from './Table';

export function TableHead() {
  const { table } = useTable();

  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => {
        return (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th
                key={header.id}
                className="text-start"
                colSpan={header.colSpan}
              >
                {header.column.columnDef.meta?.label}
              </th>
            ))}
          </tr>
        );
      })}
    </thead>
  );
}
