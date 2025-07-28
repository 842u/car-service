import { useTable } from './table';
import { TableTh } from './th';

export function TableHead() {
  const { table } = useTable();

  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => {
        return (
          <tr key={headerGroup.id} className="border-alpha-grey-300 border-b">
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
