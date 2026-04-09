import type { ChangeEvent } from 'react';

import { useTable } from '@/ui/table/table';

interface UseValuesFilterParams {
  columnId: string;
  checkboxLabelValueMapping: Record<string, string>;
}

export function useValuesFilter({
  columnId,
  checkboxLabelValueMapping,
}: UseValuesFilterParams) {
  const { table } = useTable();

  const columnLabel = table.getColumn(columnId)?.columnDef.meta?.label;

  const currentFilter = table
    .getState()
    .columnFilters.find((filter) => filter.id === columnId);

  const selectedValues = (currentFilter?.value as string[]) ?? [];
  const allValues = Object.values(checkboxLabelValueMapping);
  const allSelected = allValues.every((value) =>
    selectedValues.includes(value),
  );
  const someSelected =
    !allSelected && allValues.some((value) => selectedValues.includes(value));

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    table.setColumnFilters((currentFilters) => {
      const currentValues =
        (currentFilters.find((filter) => filter.id === columnId)
          ?.value as string[]) ?? [];

      const newValues = checked
        ? [...new Set([...currentValues, value])]
        : currentValues.filter((filterValue) => filterValue !== value);

      const withoutCurrent = currentFilters.filter(
        (filter) => filter.id !== columnId,
      );

      if (newValues.length === 0) return withoutCurrent;

      return [...withoutCurrent, { id: columnId, value: newValues }];
    });
  };

  const handleToggleAll = () => {
    table.setColumnFilters((currentFilters) => {
      const withoutCurrent = currentFilters.filter(
        (filter) => filter.id !== columnId,
      );

      if (allSelected || someSelected) {
        return withoutCurrent;
      }

      return [...withoutCurrent, { id: columnId, value: allValues }];
    });
  };

  return {
    columnLabel,
    selectedValues,
    handleCheckboxChange,
    allSelected,
    someSelected,
    handleToggleAll,
  };
}
