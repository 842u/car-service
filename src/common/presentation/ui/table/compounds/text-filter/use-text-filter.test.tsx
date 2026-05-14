import type { ColumnDef } from '@tanstack/react-table';
import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, ReactNode } from 'react';

import { Table, useTable } from '../../table';
import { useTextFilter } from './use-text-filter';

const columns: ColumnDef<{ name: string }>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    enableColumnFilter: true,
    filterFn: 'includesString',
    meta: { label: 'Name' },
  },
];

function wrapper({ children }: { children: ReactNode }) {
  return (
    <Table<{ name: string }> columns={columns} data={[]}>
      {children}
    </Table>
  );
}

describe('useTextFilter', () => {
  it('should return the column label from column meta', () => {
    const { result } = renderHook(() => useTextFilter({ columnId: 'name' }), {
      wrapper,
    });

    expect(result.current.columnLabel).toBe('Name');
  });

  it('should start with an empty inputValue when no filter is applied', () => {
    const { result } = renderHook(() => useTextFilter({ columnId: 'name' }), {
      wrapper,
    });

    expect(result.current.inputValue).toBe('');
  });

  describe('with fake timers', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should update inputValue immediately on handleInputChange before debounce fires', () => {
      const value = 'toy';

      const { result } = renderHook(
        () => useTextFilter({ columnId: 'name', debounceDelay: 200 }),
        { wrapper },
      );

      act(() => {
        result.current.handleInputChange({
          target: { value },
        } as ChangeEvent<HTMLInputElement>);
      });

      expect(result.current.inputValue).toBe(value);
    });

    it('should commit the filter to the table state after the debounce delay', () => {
      const value = 'toy';

      const { result } = renderHook(
        () => ({
          filter: useTextFilter({ columnId: 'name', debounceDelay: 200 }),
          table: useTable().table,
        }),
        { wrapper },
      );

      act(() => {
        result.current.filter.handleInputChange({
          target: { value },
        } as ChangeEvent<HTMLInputElement>);
      });

      expect(
        result.current.table.getColumn('name')?.getFilterValue(),
      ).toBeUndefined();

      act(() => {
        jest.advanceTimersByTime(200);
      });

      expect(result.current.table.getColumn('name')?.getFilterValue()).toBe(
        value,
      );
    });
  });
});
