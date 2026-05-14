import { Dropdown } from '@/ui/dropdown/dropdown';
import { TableColumnDropdownContent } from '@/ui/table/compounds/column-dropdown/content/content';
import { TableColumnDropdownTrigger } from '@/ui/table/compounds/column-dropdown/trigger/trigger';

interface TableColumnDropdownProps {
  columnId: string;
  label?: string;
  className?: string;
}

export function TableColumnDropdown({
  columnId,
  label,
  className,
}: TableColumnDropdownProps) {
  return (
    <Dropdown className={className}>
      <TableColumnDropdownTrigger columnId={columnId} label={label} />
      <TableColumnDropdownContent columnId={columnId} />
    </Dropdown>
  );
}
