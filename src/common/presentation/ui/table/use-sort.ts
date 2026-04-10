import { useTable } from '@/ui/table/table';

export function useSort(columnId: string) {
  const { table } = useTable();

  const column = table.getColumn(columnId);
  const isColumnSortSet = !!column?.getIsSorted();
  const columnSortState = table
    .getState()
    .sorting.find((sort) => sort.id === columnId);
  const columnSortDesc = !!columnSortState?.desc;

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
  };

  const handleReset = () => column?.clearSorting();

  return {
    isColumnSortSet,
    columnSortDesc,
    handleAscClick,
    handleDescClick,
    handleReset,
  };
}
