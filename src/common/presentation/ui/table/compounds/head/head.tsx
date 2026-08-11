import { useTable } from '../../table';
import { HeadTh } from './th/th';

type TableHeadProps = {
  className?: string;
};

export function TableHead({ className }: TableHeadProps) {
  const { table } = useTable();

  return (
    <thead className={className}>
      {table.getHeaderGroups().map((headerGroup) => {
        return (
          <tr
            key={headerGroup.id}
            className="border-alpha-grey-300 bg-light-600 dark:bg-dark-500 sticky top-0 z-10 rounded-md"
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
