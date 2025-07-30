import { ColumnFiltersState, Row } from '@tanstack/react-table';

import { inputVariants } from '@/utils/tailwindcss/input';

import { useTable } from './table-tempname';

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
    return rowDate.getTime() >= filterFromDate.getTime();
  }

  if (!filterFromDate && filterToDate) {
    return rowDate.getTime() <= filterToDate.getTime();
  }

  if (filterFromDate && filterToDate) {
    if (filterToDate.getTime() < filterFromDate.getTime()) {
      return false;
    }
    return (
      rowDate.getTime() >= filterFromDate.getTime() &&
      rowDate.getTime() <= filterToDate.getTime()
    );
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

type DateFilterProps = {
  columnId: string;
};

export function DateFilter({ columnId }: DateFilterProps) {
  const { table } = useTable();

  const columnLabel = table.getColumn(columnId)?.columnDef.meta?.label;

  return (
    <div className="my-4 flex flex-col gap-2 md:w-fit md:flex-row md:flex-wrap">
      <label className="md:grow">
        <p className="my-2 text-xs">From {columnLabel}</p>
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

      <label className="md:grow">
        <p className="my-2 text-xs">To {columnLabel}</p>
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
