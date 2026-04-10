import { FunnelIcon } from '@/icons/funnel';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';
import { Dropdown as BaseDropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';
import { TableSortDropdownContent } from '@/ui/table/compounds/sort-dropdown/content';
import { TableSortDropdownIcon } from '@/ui/table/compounds/sort-dropdown/icon';
import { useTable } from '@/ui/table/table';
import { useSort } from '@/ui/table/use-sort';

import { TableColumnDropdownFilter } from './filter';

interface TableColumnDropdownProps {
  columnId: string;
  label?: string;
  isSortable?: boolean;
  className?: string;
}

export function TableColumnDropdown({
  columnId,
  label,
  isSortable,
  className,
}: TableColumnDropdownProps) {
  const { table } = useTable();

  const {
    isColumnSortSet,
    columnSortDesc,
    handleAscClick,
    handleDescClick,
    handleReset,
  } = useSort(columnId);

  const filter = table.getColumn(columnId)?.columnDef.meta?.filter;
  const isFiltered = table
    .getState()
    .columnFilters.some((filter) => filter.id === columnId);

  return (
    <BaseDropdown className={className}>
      <BaseDropdown.Trigger>
        {({ onClick, ref }) => (
          <IconButton
            ref={ref}
            className="h-fit p-2 px-3"
            text={label}
            title={`${label ? label : 'Column'} options`}
            variant="transparent"
            onClick={onClick}
          >
            {isSortable && (
              <TableSortDropdownIcon
                columnSortDesc={columnSortDesc}
                isColumnSortSet={isColumnSortSet}
              />
            )}

            {filter && (
              <FunnelIcon
                className={`h-5 w-5 stroke-3 p-0.5 ${isFiltered ? 'stroke-accent-500' : 'stroke-dark-500 dark:stroke-light-500'}`}
              />
            )}
          </IconButton>
        )}
      </BaseDropdown.Trigger>

      <BaseDropdown.Content>
        {isSortable && (
          <TableSortDropdownContent
            columnSortDesc={columnSortDesc}
            handleAscClick={handleAscClick}
            handleDescClick={handleDescClick}
            handleReset={handleReset}
            isColumnSortSet={isColumnSortSet}
          />
        )}

        {isSortable && filter && (
          <TextSeparator
            className="text-alpha-grey-600 m-2 text-[10px]"
            text="FILTER"
          />
        )}

        {filter && (
          <TableColumnDropdownFilter columnId={columnId} filter={filter} />
        )}
      </BaseDropdown.Content>
    </BaseDropdown>
  );
}
