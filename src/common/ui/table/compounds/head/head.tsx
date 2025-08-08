import { useTable } from '../../table';
import { HeadTh } from './th/th';

export function TableHead() {
  const { table } = useTable();

  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => {
        return (
          <tr key={headerGroup.id} className="border-alpha-grey-300 border-b">
            {headerGroup.headers.map((header) => (
              <HeadTh
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
