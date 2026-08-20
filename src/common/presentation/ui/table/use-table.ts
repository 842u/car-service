import type { ReactTable } from '@tanstack/react-table';
import { createContext } from 'react';

import { useContextGuard } from '@/common/presentation/hook/use-context-guard';

import type { features } from './features';

// The compound components read the table without knowing the row shape, so
// the context erases it. v9's table type is invariant in its data parameter,
// which is why a concrete instance needs a cast to reach the context.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyRowTable = ReactTable<typeof features, any>;

type TableContextValue = {
  table: AnyRowTable;
};

export const TableContext = createContext<TableContextValue | null>(null);

export function useTable() {
  return useContextGuard({
    context: TableContext,
    componentName: 'Table',
  });
}
