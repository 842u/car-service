import { ChevronDownIcon } from '@/components/decorative/icons/ChevronDownIcon';
import { ChevronUpIcon } from '@/components/decorative/icons/ChevronUpIcon';

import { useTable } from './Table';

export function TableSortBreadcrumb() {
  const { table } = useTable();

  const sorting = table.getState().sorting;

  return (
    <div className="">
      <p className="my-2">Current sorting order:</p>
      <p className="overflow-auto whitespace-nowrap">
        {sorting.map((rule) => {
          const isIntrinsicRule =
            rule.id === table.options.meta?.intrinsicSort?.id;

          if (isIntrinsicRule) return;

          return (
            <span key={rule.id} className="ml-2 overflow-auto">
              {table.getColumn(rule.id)?.columnDef.meta?.label}

              {rule.desc ? (
                <ChevronDownIcon className="stroke-accent-600 dark:stroke-accent-300 mx-2 inline-block w-3 stroke-3" />
              ) : (
                <ChevronUpIcon className="stroke-accent-600 dark:stroke-accent-300 mx-2 inline-block w-3 stroke-3" />
              )}
              <span className="text-alpha-grey-500">{'/'}</span>
            </span>
          );
        })}
      </p>
    </div>
  );
}
