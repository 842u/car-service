import { useTable } from '../../table';
import { ThDropdown } from '../head/th/dropdown/dropdown';

interface TableSortBreadcrumbProps {
  className?: string;
}

export function TableSortBreadcrumb({ className }: TableSortBreadcrumbProps) {
  const { table } = useTable();

  const sorting = table.getState().sorting;

  return (
    <div className={className}>
      <p className="text-alpha-grey-900 text-xs">SORT ORDER</p>
      <div className="flex flex-wrap">
        {sorting.every(
          (rule) => rule.id === table.options.meta?.intrinsicSort?.id,
        ) && <p className="mx-2 flex h-10 items-center px-1">none</p>}

        {sorting.map((rule) => {
          const isIntrinsicRule =
            rule.id === table.options.meta?.intrinsicSort?.id;

          if (isIntrinsicRule) return;

          return (
            <div key={rule.id}>
              <ThDropdown
                className="inline-block"
                columnId={rule.id}
                label={table.getColumn(rule.id)?.columnDef.meta?.label}
              />
              <span className="text-alpha-grey-500 mx-1">{'/'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
