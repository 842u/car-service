import type { ColumnSort } from '@tanstack/react-table';
import {
  columnFilteringFeature,
  columnVisibilityFeature,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_arrIncludesSome,
  filterFn_includesString,
  metaHelper,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_datetime,
  sortFn_text,
  tableFeatures,
} from '@tanstack/react-table';

export type TableColumnMeta = {
  label: string;
  /**
   * Marks the column that absorbs the table's leftover width. The head gives
   * it `w-auto` against the `w-1` every other column gets, and the body lets
   * its content break anywhere so the column can give width back too: a
   * value with no break opportunity has the same min-content and max-content
   * size, so auto table layout has no range to work with and the column is
   * stuck at its full width.
   */
  shouldSpan?: boolean;
  filter?:
    | {
        type: 'values';
        valuesMapping: Record<string, string>;
      }
    | {
        type: 'date' | 'text';
      };
};

export type TableMeta = {
  intrinsicSort?: ColumnSort;
};

/**
 * Every table in the app shares this feature set. A v9 table only exposes the
 * APIs of the features registered here, so an API that reads as missing is a
 * feature that is missing.
 */
export const features = tableFeatures({
  columnFilteringFeature,
  columnVisibilityFeature,
  rowSortingFeature,
  filteredRowModel: createFilteredRowModel(),
  sortedRowModel: createSortedRowModel(),
  filterFns: {
    arrIncludesSome: filterFn_arrIncludesSome,
    includesString: filterFn_includesString,
  },
  // `sortFn: 'auto'` (the default for every column that does not name one)
  // resolves by looking up `datetime`, `alphanumeric`, or `text` in this
  // registry from a sample of row values, falling back to a basic comparison
  // when the name it picked is unregistered. All three are registered so
  // auto-detection keeps working for date and mixed alphanumeric columns.
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
  columnMeta: metaHelper<TableColumnMeta>(),
  tableMeta: metaHelper<TableMeta>(),
});
