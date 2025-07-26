import { useTable } from './Table';
import { TableThDropdown } from './TableThDropdown';

export function TableSortBreadcrumb() {
  const { table } = useTable();

  const sorting = table.getState().sorting;

  return (
    <>
      <p className="text-xs">Sort order</p>
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
              <TableThDropdown
                className="mx-2 inline-block"
                columnId={rule.id}
                label={table.getColumn(rule.id)?.columnDef.meta?.label}
              />
              <span className="text-alpha-grey-500">{'/'}</span>
            </div>
          );
        })}
      </div>
    </>
  );
}
