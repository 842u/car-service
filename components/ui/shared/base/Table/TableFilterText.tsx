import { ChangeEvent, useRef } from 'react';

import { inputVariants } from '@/utils/tailwindcss/input';

import { useTable } from './Table';

type TableFilterTextProps = {
  columnId: string;
  debounceDelay?: number;
};

export function TableFilterText({
  columnId,
  debounceDelay = 200,
}: TableFilterTextProps) {
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

  return (
    <label className="my-4 block w-fit" htmlFor={inputId}>
      <p className="my-2 text-xs">Filter {columnLabel}</p>
      <input
        className={inputVariants.default}
        id={inputId}
        placeholder="Enter filter text..."
        type="text"
        onChange={handleInputChange}
      />
    </label>
  );
}
