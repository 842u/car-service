import type { ColumnDef } from '@tanstack/react-table';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Table } from '../../table';

const columns: ColumnDef<{ name: string }>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    enableColumnFilter: true,
    filterFn: 'includesString',
    meta: { label: 'Name' },
  },
];

const data = [{ name: 'Toyota' }, { name: 'BMW' }, { name: 'Honda' }];

describe('TableTextFilter', () => {
  it('should render a search input with the column label as placeholder', () => {
    render(
      <Table columns={columns} data={data}>
        <Table.TextFilter columnId="name" />
      </Table>,
    );

    expect(screen.getByPlaceholderText('Search by Name')).toBeInTheDocument();
  });

  describe('with fake timers', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should filter visible rows after the debounce delay', async () => {
      const user = userEvent.setup({
        advanceTimers: jest.advanceTimersByTime,
      });

      render(
        <Table columns={columns} data={data}>
          <Table.TextFilter columnId="name" debounceDelay={200} />
          <Table.Root>
            <Table.Body />
          </Table.Root>
        </Table>,
      );

      await user.type(screen.getByRole('textbox'), 'toy');
      await act(async () => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByText('Toyota')).toBeInTheDocument();
      expect(screen.queryByText('BMW')).not.toBeInTheDocument();
      expect(screen.queryByText('Honda')).not.toBeInTheDocument();
    });

    it('should show the empty state when no rows match the filter', async () => {
      const user = userEvent.setup({
        advanceTimers: jest.advanceTimersByTime,
      });

      render(
        <Table columns={columns} data={data}>
          <Table.TextFilter columnId="name" debounceDelay={200} />
          <Table.Root>
            <Table.Body />
          </Table.Root>
        </Table>,
      );

      await user.type(screen.getByRole('textbox'), 'zzz');
      await act(async () => {
        jest.advanceTimersByTime(200);
      });

      expect(screen.getByText('No matching results')).toBeInTheDocument();
    });
  });
});
