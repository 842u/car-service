import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

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

  const currentFilter = table
    .getState()
    .columnFilters.find((filter) => filter.id === columnId);

  const committedValue =
    typeof currentFilter?.value === 'string' ? currentFilter.value : '';

  const [inputValue, setInputValue] = useState(committedValue);

  useEffect(() => {
    setInputValue(committedValue);
  }, [committedValue]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setInputValue(value);

    clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      table.setColumnFilters((currentFilters) => {
        const exists = currentFilters.some((filter) => filter.id === columnId);

        if (!exists) {
          return [...currentFilters, { id: columnId, value }];
        }

        return currentFilters.map((filter) =>
          filter.id === columnId ? { ...filter, value } : filter,
        );
      });
    }, debounceDelay);
  };

  return {
    columnLabel,
    inputValue,
    handleInputChange,
  };
}
