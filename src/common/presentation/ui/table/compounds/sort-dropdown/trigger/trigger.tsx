import { Dropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';
import { TableSortDropdownIcon } from '@/ui/table/compounds/sort-dropdown/trigger/icon';
import { useColumnSortState } from '@/ui/table/use-column-sort-state';

interface TableSortDropdownTriggerProps {
  columnId: string;
  label?: string;
}

export function TableSortDropdownTrigger({
  columnId,
  label,
}: TableSortDropdownTriggerProps) {
  const { isColumnSortDesc, isColumnSortSet } = useColumnSortState(columnId);

  return (
    <Dropdown.Trigger>
      {({ onClick, ref }) => (
        <IconButton
          ref={ref}
          className="h-fit p-2 px-3"
          text={label}
          title="sort"
          variant="transparent"
          onClick={onClick}
        >
          <TableSortDropdownIcon
            isColumnSortDesc={isColumnSortDesc}
            isColumnSortSet={isColumnSortSet}
          />
        </IconButton>
      )}
    </Dropdown.Trigger>
  );
}
