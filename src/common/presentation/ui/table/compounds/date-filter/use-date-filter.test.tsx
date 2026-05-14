import type { ColumnDef } from '@tanstack/react-table';
import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, ReactNode } from 'react';

import { Table } from '../../table';
import { useDateFilter } from './use-date-filter';

const columns: ColumnDef<{ date: string }>[] = [
  { id: 'date', accessorKey: 'date', meta: { label: 'Date' } },
];

function wrapper({ children }: { children: ReactNode }) {
  return (
    <Table<{ date: string }> columns={columns} data={[]}>
      {children}
    </Table>
  );
}

describe('useDateFilter', () => {
  it('should return the column label from column meta', () => {
    const { result } = renderHook(() => useDateFilter({ columnId: 'date' }), {
      wrapper,
    });

    expect(result.current.columnLabel).toBe('Date');
  });

  it('should return empty strings for fromDate and toDate when no filter is applied', () => {
    const { result } = renderHook(() => useDateFilter({ columnId: 'date' }), {
      wrapper,
    });

    expect(result.current.fromDate).toBe('');
    expect(result.current.toDate).toBe('');
  });

  it('should update fromDate after onFromDateChange is called', () => {
    const date = '2026-01-01';
    const { result } = renderHook(() => useDateFilter({ columnId: 'date' }), {
      wrapper,
    });

    act(() => {
      result.current.onFromDateChange({
        target: { value: date },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.fromDate).toBe(date);
  });

  it('should update toDate after onToDateChange is called', () => {
    const date = '2026-12-31';
    const { result } = renderHook(() => useDateFilter({ columnId: 'date' }), {
      wrapper,
    });

    act(() => {
      result.current.onToDateChange({
        target: { value: date },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.toDate).toBe(date);
  });

  it('should preserve the existing date when only one side is changed', () => {
    const from = '2026-01-01';
    const to = '2026-06-30';
    const { result } = renderHook(() => useDateFilter({ columnId: 'date' }), {
      wrapper,
    });

    act(() => {
      result.current.onFromDateChange({
        target: { value: from },
      } as ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onToDateChange({
        target: { value: to },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.fromDate).toBe(from);
    expect(result.current.toDate).toBe(to);
  });
});
