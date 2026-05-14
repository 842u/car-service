import type { ColumnDef } from '@tanstack/react-table';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Table } from './table';
import { useColumnFilterState } from './use-column-filter-state';

interface TestRow {
  status: string;
}

const filterMeta = { type: 'text' as const };

const columns: ColumnDef<TestRow>[] = [
  {
    id: 'status',
    accessorKey: 'status',
    enableColumnFilter: true,
    filterFn: 'includesString',
    meta: { label: 'Status', filter: filterMeta },
  },
];

function wrapper({ children }: { children: ReactNode }) {
  return (
    <Table<TestRow> columns={columns} data={[]}>
      {children}
    </Table>
  );
}

describe('useColumnFilterState', () => {
  it('should report isFilterable true when enableColumnFilter is set', () => {
    const { result } = renderHook(() => useColumnFilterState('status'), {
      wrapper,
    });

    expect(result.current.isFilterable).toBe(true);
  });

  it('should return the filter meta from the column definition', () => {
    const { result } = renderHook(() => useColumnFilterState('status'), {
      wrapper,
    });

    expect(result.current.filterMeta).toEqual(filterMeta);
  });

  it('should report isFiltered false when no filter is applied', () => {
    const { result } = renderHook(() => useColumnFilterState('status'), {
      wrapper,
    });

    expect(result.current.isFiltered).toBe(false);
  });

  it('should report isFiltered true when a filter value is set via initialState', () => {
    function filteredWrapper({ children }: { children: ReactNode }) {
      return (
        <Table<TestRow>
          columns={columns}
          data={[{ status: 'active' }]}
          options={{
            initialState: {
              columnFilters: [{ id: 'status', value: 'active' }],
            },
          }}
        >
          {children}
        </Table>
      );
    }

    const { result } = renderHook(() => useColumnFilterState('status'), {
      wrapper: filteredWrapper,
    });

    expect(result.current.isFiltered).toBe(true);
  });
});
