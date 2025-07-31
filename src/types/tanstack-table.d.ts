/* eslint @typescript-eslint/no-unused-vars:0 */

import type { ColumnSort } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    label: string;
    shouldSpan?: boolean;
  }

  interface TableMeta<TData extends RowData> {
    intrinsicSort?: ColumnSort;
  }
}
