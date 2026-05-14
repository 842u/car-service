import type { ColumnDef } from '@tanstack/react-table';
import { renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';

import { Table } from './table';
import { useColumnSortState } from './use-column-sort-state';

interface TestRow {
  name: string;
}

const columns: ColumnDef<TestRow>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    enableSorting: true,
    meta: { label: 'Name' },
  },
];

function wrapper({ children }: { children: ReactNode }) {
  return (
    <Table<TestRow> columns={columns} data={[]}>
      {children}
    </Table>
  );
}

describe('useColumnSortState', () => {
  it('should report isSortable true when the column has enableSorting', () => {
    const { result } = renderHook(() => useColumnSortState('name'), {
      wrapper,
    });

    expect(result.current.isSortable).toBe(true);
  });

  it('should report isSorted false when no sort is applied', () => {
    const { result } = renderHook(() => useColumnSortState('name'), {
      wrapper,
    });

    expect(result.current.isSorted).toBe(false);
  });

  it('should report isSorted true and the correct direction when sorting is applied', () => {
    function sortedWrapper({ children }: { children: ReactNode }) {
      return (
        <Table<TestRow>
          columns={columns}
          data={[]}
          options={{ initialState: { sorting: [{ id: 'name', desc: true }] } }}
        >
          {children}
        </Table>
      );
    }

    const { result } = renderHook(() => useColumnSortState('name'), {
      wrapper: sortedWrapper,
    });

    expect(result.current.isSorted).toBe(true);
    expect(result.current.isSortDesc).toBe(true);
  });

  it('should report isSortable falsy when enableSorting is not set on the column', () => {
    const unsortableColumns: ColumnDef<TestRow>[] = [
      { id: 'name', accessorKey: 'name', meta: { label: 'Name' } },
    ];

    function unsortableWrapper({ children }: { children: ReactNode }) {
      return (
        <Table<TestRow> columns={unsortableColumns} data={[]}>
          {children}
        </Table>
      );
    }

    const { result } = renderHook(() => useColumnSortState('name'), {
      wrapper: unsortableWrapper,
    });

    expect(result.current.isSortable).toBeFalsy();
  });
});
