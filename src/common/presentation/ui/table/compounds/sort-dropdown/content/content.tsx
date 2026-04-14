import { Dropdown, useDropdown } from '@/ui/dropdown/dropdown';
import { TableSortDropdownInnerContent } from '@/ui/table/compounds/sort-dropdown/content/inner';
import { useColumnSortState } from '@/ui/table/use-column-sort-state';

interface TableSortDropdownContentProps {
  columnId: string;
}

export function TableSortDropdownContent({
  columnId,
}: TableSortDropdownContentProps) {
  const { isColumnSortDesc, isColumnSortSet, columnSortState, table } =
    useColumnSortState(columnId);

  const { close } = useDropdown();

  const handleAscClick = () => {
    table.setSorting((currentSorting) => {
      const intrinsicSort = table.options.meta?.intrinsicSort;
      const newSortingState = currentSorting.filter(
        (sort) => sort.id !== intrinsicSort?.id,
      );

      if (isColumnSortSet && columnSortState) {
        columnSortState.desc = false;
      } else {
        newSortingState.push({ id: columnId, desc: false });
      }

      intrinsicSort && newSortingState.push(intrinsicSort);
      return newSortingState;
    });

    close();
  };

  const handleDescClick = () => {
    table.setSorting((currentSorting) => {
      const intrinsicSort = table.options.meta?.intrinsicSort;
      const newSortingState = currentSorting.filter(
        (sort) => sort.id !== intrinsicSort?.id,
      );

      if (isColumnSortSet && columnSortState) {
        columnSortState.desc = true;
      } else {
        newSortingState.push({ id: columnId, desc: true });
      }

      intrinsicSort && newSortingState.push(intrinsicSort);
      return newSortingState;
    });

    close();
  };

  const handleReset = () => table.getColumn(columnId)?.clearSorting();

  return (
    <Dropdown.Content>
      <TableSortDropdownInnerContent
        handleAscClick={handleAscClick}
        handleDescClick={handleDescClick}
        handleReset={handleReset}
        isColumnSortDesc={isColumnSortDesc}
        isColumnSortSet={!!isColumnSortSet}
      />
    </Dropdown.Content>
  );
}
