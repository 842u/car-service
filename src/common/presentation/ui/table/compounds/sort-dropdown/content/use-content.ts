import { useDropdown } from '@/ui/dropdown/dropdown';
import { useColumnSortState } from '@/ui/table/use-column-sort-state';

interface UseTableSortDropdownContentParams {
  columnId: string;
}

export function useTableSortDropdownContent({
  columnId,
}: UseTableSortDropdownContentParams) {
  const { isSortDesc, isSorted, sortState, table, isSortable } =
    useColumnSortState(columnId);

  const { close } = useDropdown();

  const handleAscClick = () => {
    table.setSorting((currentSorting) => {
      const intrinsicSort = table.options.meta?.intrinsicSort;
      const newSortingState = currentSorting.filter(
        (sort) => sort.id !== intrinsicSort?.id,
      );

      if (isSorted && sortState) {
        sortState.desc = false;
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

      if (isSorted && sortState) {
        sortState.desc = true;
      } else {
        newSortingState.push({ id: columnId, desc: true });
      }

      intrinsicSort && newSortingState.push(intrinsicSort);

      return newSortingState;
    });

    close();
  };

  const handleReset = () => table.getColumn(columnId)?.clearSorting();

  return {
    isSortable,
    isSortDesc,
    isSorted,
    sortState,
    handleAscClick,
    handleDescClick,
    handleReset,
  };
}
