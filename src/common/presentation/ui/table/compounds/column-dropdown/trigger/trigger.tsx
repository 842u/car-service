import { FunnelIcon } from '@/icons/funnel';
import { Dropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';
import { TableSortDropdownIcon } from '@/ui/table/compounds/sort-dropdown/trigger/icon';
import { useColumnFilterState } from '@/ui/table/use-column-filter-state';
import { useColumnSortState } from '@/ui/table/use-column-sort-state';

interface TableColumnDropdownTriggerProps {
  columnId: string;
  label?: string;
}

export function TableColumnDropdownTrigger({
  columnId,
  label,
}: TableColumnDropdownTriggerProps) {
  const { isSortDesc, isSorted, isSortable } = useColumnSortState(columnId);

  const { isFiltered, filterMeta, isFilterable } =
    useColumnFilterState(columnId);

  return (
    <Dropdown.Trigger>
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
              isSortDesc={isSortDesc}
              isSorted={isSorted}
            />
          )}

          {filterMeta && isFilterable && (
            <FunnelIcon
              className={`h-5 w-5 stroke-3 p-0.5 ${isFiltered ? 'stroke-accent-500' : 'stroke-dark-500 dark:stroke-light-500'}`}
            />
          )}
        </IconButton>
      )}
    </Dropdown.Trigger>
  );
}
