import { useTable } from '@/ui/table/table';

export function useColumnFilterState(columnId: string) {
  const { table } = useTable();

  const column = table.getColumn(columnId);
  const filterMeta = column?.columnDef.meta?.filter;
  const isFiltered = column?.getIsFiltered();
  const isFilterable = !!column?.getCanFilter();

  return {
    filterMeta,
    isFiltered,
    isFilterable,
    table,
  };
}
