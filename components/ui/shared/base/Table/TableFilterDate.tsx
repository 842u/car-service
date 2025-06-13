import { ColumnFiltersState, Row } from '@tanstack/react-table';

import { inputVariants } from '@/utils/tailwindcss/input';

import { useTable } from './Table';

type DateFilter = { from?: string; to?: string };

// eslint-disable-next-line
export function filterColumnByDate<T extends Record<string, any>>(
  row: Row<T>,
  columnId: string,
  filterValue: DateFilter,
) {
  const rowDate = new Date(row.original[columnId]);

  if (Number.isNaN(rowDate.valueOf())) {
    return false;
  }

  let filterFromDate: Date | null = new Date(filterValue.from || '');
  let filterToDate: Date | null = new Date(filterValue.to || '');

  if (Number.isNaN(filterFromDate.valueOf())) {
    filterFromDate = null;
  }
  if (Number.isNaN(filterToDate.valueOf())) {
    filterToDate = null;
  }

  if (!filterFromDate && !filterToDate) {
    return true;
  }

  if (filterFromDate && !filterToDate) {
    return rowDate >= filterFromDate;
  }

  if (!filterFromDate && filterToDate) {
    return rowDate <= filterToDate;
  }

  if (filterFromDate && filterToDate) {
    if (filterToDate < filterFromDate) {
      return false;
    }
    return rowDate >= filterFromDate && rowDate <= filterToDate;
  }

  return true;
}

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

type TableFilterDateProps = {
  columnId: string;
};

export function TableFilterDate({ columnId }: TableFilterDateProps) {
  const { table } = useTable();

  const columnLabel = table.getColumn(columnId)?.columnDef.meta?.label;

  return (
    <div className="my-4 w-fit">
      <p>{columnLabel}</p>

      <label className="inline-block">
        <span className="text-xs">From</span>
        <input
          className={inputVariants.default}
          type="date"
          onChange={(event) => {
            table.setColumnFilters((currentFilters) =>
              getUpdatedFiltersState(
                currentFilters,
                columnId,
                'from',
                event.target.value,
              ),
            );
          }}
        />
      </label>

      <label className="inline-block">
        <span className="text-xs">To</span>
        <input
          className={inputVariants.default}
          type="date"
          onChange={(event) => {
            table.setColumnFilters((currentFilters) =>
              getUpdatedFiltersState(
                currentFilters,
                columnId,
                'to',
                event.target.value,
              ),
            );
          }}
        />
      </label>
    </div>
  );
}
