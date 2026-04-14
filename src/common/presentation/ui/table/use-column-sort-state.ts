import { useTable } from '@/ui/table/table';

export function useColumnSortState(columnId: string) {
  const { table } = useTable();

  const column = table.getColumn(columnId);
  const isColumnSortSet = !!column?.getIsSorted();
  const columnSortState = table
    .getState()
    .sorting.find((sort) => sort.id === columnId);
  const isColumnSortDesc = !!columnSortState?.desc;

  return {
    isColumnSortSet,
    isColumnSortDesc,
    columnSortState,
    table,
  };
}
