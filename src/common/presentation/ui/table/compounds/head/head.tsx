import { useTable } from '../../table';
import { HeadTh } from './th/th';

interface TableHeadProps {
  className?: string;
}

export function TableHead({ className }: TableHeadProps) {
  const { table } = useTable();

  return (
    <thead className={className}>
      {table.getHeaderGroups().map((headerGroup) => {
        return (
          <tr
            key={headerGroup.id}
            className="border-alpha-grey-300 sticky top-0 z-10 rounded-md backdrop-blur-3xl"
          >
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
