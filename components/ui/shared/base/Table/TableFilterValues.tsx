'use client';

import { ChangeEvent } from 'react';

import { useTable } from './Table';

type TableFilterValuesProps = {
  columnId: string;
  checkboxLabelValueMapping: Record<string, string>;
};

export function TableFilterValues({
  columnId,
  checkboxLabelValueMapping,
}: TableFilterValuesProps) {
  const { table } = useTable();

  const columnLabel = table.getColumn(columnId)?.columnDef.meta?.label;

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;

    table.setColumnFilters((currentFilters) => {
      const currentColumnFilter = currentFilters.find(
        (filter) => filter.id === columnId,
      );

      if (checked) {
        if (!currentColumnFilter) {
          return [...currentFilters, { id: columnId, value: [value] }];
        } else {
          const currentValues = currentColumnFilter.value as unknown[];

          if (!currentValues.includes(value)) {
            return currentFilters.map((filter) =>
              filter.id === columnId
                ? { ...filter, value: [...currentValues, value] }
                : filter,
            );
          }

          return currentFilters;
        }
      } else {
        if (currentColumnFilter) {
          const newValues = (currentColumnFilter.value as unknown[]).filter(
            (filterValue) => filterValue !== value,
          );

          return currentFilters.map((filter) =>
            filter.id === columnId ? { ...filter, value: newValues } : filter,
          );
        }

        return currentFilters;
      }
    });
  };

  return (
    <fieldset>
      <legend>
        <p>{columnLabel}</p>
      </legend>
      {Object.keys(checkboxLabelValueMapping).map((checkboxLabel) => {
        return (
          <label
            key={checkboxLabel}
            className="accent-accent-500 block text-base"
          >
            <input
              className="mr-2"
              id={`checkbox-${checkboxLabel}`}
              name={columnId}
              type="checkbox"
              value={checkboxLabelValueMapping[checkboxLabel]}
              onChange={handleCheckboxChange}
            />
            {checkboxLabel}
          </label>
        );
      })}
    </fieldset>
  );
}
