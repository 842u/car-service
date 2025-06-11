import { useTable } from './Table';
import { TableTh } from './TableTh';

export function TableHead() {
  const { table } = useTable();

  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => {
        return (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableTh
                key={header.id}
                colSpan={header.colSpan}
                header={header}
              />
            ))}
          </tr>
        );
      })}
    </thead>
  );
}
