import { Dropdown } from '@/ui/dropdown/dropdown';
import { TableSortDropdownInnerContent } from '@/ui/table/compounds/sort-dropdown/content/inner';
import { useTableSortDropdownContent } from '@/ui/table/compounds/sort-dropdown/content/use-content';

interface TableSortDropdownContentProps {
  columnId: string;
}

export function TableSortDropdownContent({
  columnId,
}: TableSortDropdownContentProps) {
  const { isSortDesc, isSorted, handleAscClick, handleDescClick, handleReset } =
    useTableSortDropdownContent({ columnId });

  return (
    <Dropdown.Content>
      <TableSortDropdownInnerContent
        handleAscClick={handleAscClick}
        handleDescClick={handleDescClick}
        handleReset={handleReset}
        isSortDesc={isSortDesc}
        isSorted={isSorted}
      />
    </Dropdown.Content>
  );
}
