import { useDropdown } from '@/ui/dropdown/use-dropdown';
import { useColumnSortState } from '@/ui/table/use-column-sort-state';

type UseTableSortDropdownContentParams = {
  columnId: string;
};

export function useTableSortDropdownContent({
  columnId,
}: UseTableSortDropdownContentParams) {
  const { isSortDesc, isSorted, sortState, table, isSortable } =
    useColumnSortState(columnId);

  const { close } = useDropdown();

  const sortBy = (desc: boolean) => {
    table.setSorting((currentSorting) => {
      const intrinsicSort = table.options.meta?.intrinsicSort;
      // The intrinsic rule is dropped here and appended last so it stays the
      // final tiebreaker behind whatever the user picks.
      const userSorting = currentSorting.filter(
        (sort) => sort.id !== intrinsicSort?.id,
      );
      const isColumnSorted = userSorting.some((sort) => sort.id === columnId);

      // Every changed rule is a new object. The sorted row model compares its
      // inputs by identity, so flipping `desc` on the rule already in state
      // leaves it serving the previous order.
      const newSortingState = isColumnSorted
        ? userSorting.map((sort) =>
            sort.id === columnId ? { ...sort, desc } : sort,
          )
        : [...userSorting, { id: columnId, desc }];

      intrinsicSort && newSortingState.push(intrinsicSort);

      return newSortingState;
    });

    close();
  };

  const handleAscClick = () => sortBy(false);

  const handleDescClick = () => sortBy(true);

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
