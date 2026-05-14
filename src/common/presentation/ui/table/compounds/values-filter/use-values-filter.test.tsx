import type { ColumnDef } from '@tanstack/react-table';
import { act, renderHook } from '@testing-library/react';
import type { ChangeEvent, ReactNode } from 'react';

import { Table } from '../../table';
import { useValuesFilter } from './use-values-filter';

interface TestRow {
  status: string;
}

const columns: ColumnDef<TestRow>[] = [
  {
    id: 'status',
    accessorKey: 'status',
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue: string[]) =>
      filterValue.includes(row.getValue('status') as string),
    meta: { label: 'Status' },
  },
];

const checkboxLabelValueMapping = {
  Active: 'active',
  Inactive: 'inactive',
};

function wrapper({ children }: { children: ReactNode }) {
  return (
    <Table columns={columns} data={[]}>
      {children}
    </Table>
  );
}

function renderFilter() {
  return renderHook(
    () => useValuesFilter({ columnId: 'status', checkboxLabelValueMapping }),
    { wrapper },
  );
}

describe('useValuesFilter', () => {
  it('should return the column label from column meta', () => {
    const { result } = renderFilter();

    expect(result.current.label).toBe('Status');
  });

  it('should start with no selected values', () => {
    const { result } = renderFilter();

    expect(result.current.selectedValues).toEqual([]);
    expect(result.current.allSelected).toBe(false);
    expect(result.current.someSelected).toBe(false);
  });

  it('should add a value to selectedValues when a checkbox is checked', () => {
    const value = 'active';
    const { result } = renderFilter();

    act(() => {
      result.current.handleCheckboxChange({
        target: { value, checked: true },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.selectedValues).toContain(value);
  });

  it('should remove a value from selectedValues when a checkbox is unchecked', () => {
    const value = 'active';
    const { result } = renderFilter();

    act(() => {
      result.current.handleCheckboxChange({
        target: { value, checked: true },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.selectedValues).toContain(value);

    act(() => {
      result.current.handleCheckboxChange({
        target: { value, checked: false },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.selectedValues).not.toContain(value);
  });

  it('should report allSelected when every option is checked', () => {
    const { result } = renderFilter();

    act(() => {
      result.current.handleCheckboxChange({
        target: { value: 'active', checked: true },
      } as ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleCheckboxChange({
        target: { value: 'inactive', checked: true },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.allSelected).toBe(true);
    expect(result.current.someSelected).toBe(false);
  });

  it('should report someSelected when only a subset of options is checked', () => {
    const { result } = renderFilter();

    act(() => {
      result.current.handleCheckboxChange({
        target: { value: 'active', checked: true },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.someSelected).toBe(true);
    expect(result.current.allSelected).toBe(false);
  });

  it('should select all values when handleToggleAll is called with none selected', () => {
    const { result } = renderFilter();

    act(() => {
      result.current.handleToggleAll();
    });

    expect(result.current.selectedValues).toEqual(
      expect.arrayContaining(['active', 'inactive']),
    );
  });

  it('should clear all values when handleToggleAll is called with someSelected', () => {
    const { result } = renderFilter();

    act(() => {
      result.current.handleCheckboxChange({
        target: { value: 'active', checked: true },
      } as ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleToggleAll();
    });

    expect(result.current.selectedValues).toEqual([]);
  });

  it('should clear all values when handleToggleAll is called with allSelected', () => {
    const { result } = renderFilter();

    act(() => {
      result.current.handleCheckboxChange({
        target: { value: 'active', checked: true },
      } as ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.handleCheckboxChange({
        target: { value: 'inactive', checked: true },
      } as ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.allSelected).toBe(true);

    act(() => {
      result.current.handleToggleAll();
    });

    expect(result.current.selectedValues).toEqual([]);
  });
});
