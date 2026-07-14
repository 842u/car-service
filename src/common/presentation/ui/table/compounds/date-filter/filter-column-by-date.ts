import type { Row } from '@tanstack/react-table';

type DateFilter = { from?: string; to?: string };

// The TanStack Row generic needs an index signature to read row.original[columnId];
// unknown would force a cast on new Date(...).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
