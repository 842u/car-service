import { useTable } from '@/ui/table/table';

export function useColumnSortState(columnId: string) {
  const { table } = useTable();

  const column = table.getColumn(columnId);
  const isSorted = !!column?.getIsSorted();
  const sortState = table
    .getState()
    .sorting.find((sort) => sort.id === columnId);
  const isSortDesc = !!sortState?.desc;
  const isSortable = column?.columnDef.enableSorting;

  return {
    isSorted,
    isSortDesc,
    sortState,
    isSortable,
    table,
  };
}
