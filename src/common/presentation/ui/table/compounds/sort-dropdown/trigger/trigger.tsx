import { Dropdown } from '@/ui/dropdown/dropdown';
import { IconButton } from '@/ui/icon-button/icon-button';
import { TableSortDropdownIcon } from '@/ui/table/compounds/sort-dropdown/trigger/icon';
import { useColumnSortState } from '@/ui/table/use-column-sort-state';

type TableSortDropdownTriggerProps = {
  columnId: string;
  label?: string;
};

export function TableSortDropdownTrigger({
  columnId,
  label,
}: TableSortDropdownTriggerProps) {
  const { isSortDesc, isSorted } = useColumnSortState(columnId);

  return (
    <Dropdown.Trigger>
      {(triggerProps) => (
        <IconButton
          {...triggerProps}
          size="sm"
          text={label}
          title={`Sort by ${label ?? 'column'}`}
          variant="transparent"
        >
          <TableSortDropdownIcon isSortDesc={isSortDesc} isSorted={isSorted} />
        </IconButton>
      )}
    </Dropdown.Trigger>
  );
}
