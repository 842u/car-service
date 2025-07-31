import { useTable } from '../../table';
import { Th } from './th/th';

export function Head() {
  const { table } = useTable();

  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => {
        return (
          <tr key={headerGroup.id} className="border-alpha-grey-300 border-b">
            {headerGroup.headers.map((header) => (
              <Th key={header.id} colSpan={header.colSpan} header={header} />
            ))}
          </tr>
        );
      })}
    </thead>
  );
}
