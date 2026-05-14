import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Table } from '../../table';

const columns: ColumnDef<{ date: string }>[] = [
  { id: 'date', accessorKey: 'date', meta: { label: 'Date' } },
];

const filterableColumns: ColumnDef<{ date: string }>[] = [
  {
    id: 'date',
    accessorKey: 'date',
    enableColumnFilter: true,
    filterFn: (row, _columnId, filterValue: { from?: string; to?: string }) => {
      const date = row.getValue('date') as string;
      if (filterValue.from && date < filterValue.from) return false;
      if (filterValue.to && date > filterValue.to) return false;
      return true;
    },
    meta: { label: 'Date' },
  },
];

const filterableData = [
  { date: '2026-01-15' },
  { date: '2026-06-20' },
  { date: '2026-12-25' },
];

describe('TableDateFilter', () => {
  it('should render from and to date inputs labeled with the column name', () => {
    render(
      <Table columns={columns} data={[]}>
        <Table.DateFilter columnId="date" />
      </Table>,
    );

    expect(screen.getByTitle('From Date')).toBeInTheDocument();
    expect(screen.getByTitle('To Date')).toBeInTheDocument();
  });

  it('should reflect a changed from-date value in the input', async () => {
    const date = '2026-01-01';
    const user = userEvent.setup();
    render(
      <Table columns={columns} data={[]}>
        <Table.DateFilter columnId="date" />
      </Table>,
    );

    await user.type(screen.getByTitle('From Date'), date);

    expect(screen.getByTitle('From Date')).toHaveValue(date);
  });

  it('should reflect a changed to-date value in the input', async () => {
    const date = '2026-12-31';
    const user = userEvent.setup();
    render(
      <Table columns={columns} data={[]}>
        <Table.DateFilter columnId="date" />
      </Table>,
    );

    await user.type(screen.getByTitle('To Date'), date);

    expect(screen.getByTitle('To Date')).toHaveValue(date);
  });

  it('should hide rows outside the from-date boundary after the date is entered', async () => {
    const from = '2026-06-01';
    const user = userEvent.setup();

    render(
      <Table columns={filterableColumns} data={filterableData}>
        <Table.DateFilter columnId="date" />
        <Table.Root>
          <Table.Body />
        </Table.Root>
      </Table>,
    );

    await user.type(screen.getByTitle('From Date'), from);

    expect(screen.queryByText('2026-01-15')).not.toBeInTheDocument();
    expect(screen.getByText('2026-06-20')).toBeInTheDocument();
    expect(screen.getByText('2026-12-25')).toBeInTheDocument();
  });
});
