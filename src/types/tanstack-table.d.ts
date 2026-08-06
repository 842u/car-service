/* eslint @typescript-eslint/no-unused-vars:0 */

import type { ColumnSort } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
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
  }

  interface TableMeta<TData extends RowData> {
    intrinsicSort?: ColumnSort;
  }
}
