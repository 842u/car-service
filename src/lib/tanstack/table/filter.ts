import type { Row } from '@tanstack/react-table';

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
