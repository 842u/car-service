import type { ColumnFiltersState } from '@tanstack/react-table';

import { useTable } from '@/ui/table/table';

function getUpdatedFiltersState(
  filters: ColumnFiltersState,
  columnId: string,
  valueKey: 'from' | 'to',
  value: string,
) {
  const currentColumnFilter = filters.find((filter) => filter.id === columnId);

  if (!currentColumnFilter) {
    return [
      ...filters,
      {
        id: columnId,
        value: {
          [valueKey]: value,
        },
      },
    ];
  } else {
    if (currentColumnFilter.value instanceof Object) {
      currentColumnFilter.value = {
        ...currentColumnFilter.value,
        [valueKey]: value,
      };
    }

    return [...filters];
  }
}

interface UseDateFilterParams {
  columnId: string;
}

export function useDateFilter({ columnId }: UseDateFilterParams) {
  const { table } = useTable();

  const columnLabel = table.getColumn(columnId)?.columnDef.meta?.label;

  const onFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.setColumnFilters((currentFilters) =>
      getUpdatedFiltersState(
        currentFilters,
        columnId,
        'from',
        event.target.value,
      ),
    );
  };

  const onToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    table.setColumnFilters((currentFilters) =>
      getUpdatedFiltersState(
        currentFilters,
        columnId,
        'to',
        event.target.value,
      ),
    );
  };

  return {
    columnLabel,
    onFromDateChange,
    onToDateChange,
  };
}
