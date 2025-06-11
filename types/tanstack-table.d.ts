/* eslint @typescript-eslint/no-unused-vars:0 */

import { ColumnSort } from '@tanstack/react-table';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    label: string;
  }

  interface TableMeta<TData extends RowData> {
    intrinsicSort?: ColumnSort;
  }
}
