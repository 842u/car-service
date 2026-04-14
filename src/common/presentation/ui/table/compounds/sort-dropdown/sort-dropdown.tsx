import { Dropdown } from '@/ui/dropdown/dropdown';
import { TableSortDropdownContent } from '@/ui/table/compounds/sort-dropdown/content/content';
import { TableSortDropdownTrigger } from '@/ui/table/compounds/sort-dropdown/trigger/trigger';

interface TableSortDropdownProps {
  columnId: string;
  label?: string;
  className?: string;
}

export function TableSortDropdown({
  columnId,
  label,
  className,
}: TableSortDropdownProps) {
  return (
    <Dropdown className={className}>
      <TableSortDropdownTrigger columnId={columnId} label={label} />
      <TableSortDropdownContent columnId={columnId} />
    </Dropdown>
  );
}
