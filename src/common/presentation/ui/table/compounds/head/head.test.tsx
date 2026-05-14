import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Table } from '../../table';

interface TestRow {
  name: string;
  status: string;
}

function renderHead(columns: ColumnDef<TestRow>[]) {
  return render(
    <Table columns={columns} data={[]}>
      <Table.Root>
        <Table.Head />
      </Table.Root>
    </Table>,
  );
}

describe('TableHead', () => {
  it('should render the column label directly when a column is neither sortable nor filterable', () => {
    const columns: ColumnDef<TestRow>[] = [
      { id: 'name', accessorKey: 'name', meta: { label: 'Name' } },
    ];

    renderHead(columns);

    expect(screen.getByRole('columnheader')).toHaveTextContent('Name');
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should render a dropdown trigger button for a sortable column', () => {
    const columns: ColumnDef<TestRow>[] = [
      {
        id: 'name',
        accessorKey: 'name',
        enableSorting: true,
        meta: { label: 'Name' },
      },
    ];

    renderHead(columns);

    expect(
      screen.getByRole('button', { name: 'Name options' }),
    ).toBeInTheDocument();
  });

  it('should show sort options in a dropdown when the column header button is clicked', async () => {
    const user = userEvent.setup();
    const columns: ColumnDef<TestRow>[] = [
      {
        id: 'name',
        accessorKey: 'name',
        enableSorting: true,
        meta: { label: 'Name' },
      },
    ];

    renderHead(columns);

    await user.click(screen.getByRole('button', { name: 'Name options' }));

    expect(screen.getByRole('button', { name: 'Asc' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desc' })).toBeInTheDocument();
  });

  it('should render a dropdown trigger button for a filterable column', () => {
    const columns: ColumnDef<TestRow>[] = [
      {
        id: 'status',
        accessorKey: 'status',
        enableColumnFilter: true,
        meta: { label: 'Status', filter: { type: 'text' } },
      },
    ];

    renderHead(columns);

    expect(
      screen.getByRole('button', { name: 'Status options' }),
    ).toBeInTheDocument();
  });
});
