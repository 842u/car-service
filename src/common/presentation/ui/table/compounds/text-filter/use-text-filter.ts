import type { ChangeEvent } from 'react';
import { useRef } from 'react';

import { useTable } from '@/ui/table/table';

interface UseTextFilterParams {
  columnId: string;
  debounceDelay?: number;
}

export function useTextFilter({
  columnId,
  debounceDelay = 200,
}: UseTextFilterParams) {
  const debounceTimerRef = useRef<NodeJS.Timeout>(undefined);

  const { table } = useTable();

  const columnLabel = table.getColumn(columnId)?.columnDef.meta?.label;
  const inputId = `filter-${columnId}`;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      const inputValue = event.target.value;

      table.setColumnFilters((currentFilters) => {
        const currentColumnFilter = currentFilters.find(
          (filter) => filter.id === columnId,
        );

        if (!currentColumnFilter) {
          currentFilters.push({ id: columnId, value: inputValue });
          return currentFilters;
        } else {
          const updatedFilters = currentFilters.map((filter) => {
            if (filter.id === columnId) {
              filter.value = inputValue;
            }

            return { ...filter };
          });

          return updatedFilters;
        }
      });
    }, debounceDelay);
  };

  return {
    columnLabel,
    inputId,
    handleInputChange,
  };
}
