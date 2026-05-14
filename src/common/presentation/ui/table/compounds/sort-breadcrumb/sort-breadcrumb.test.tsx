import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Table } from '../../table';

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

describe('TableSortBreadcrumb', () => {
  it('should show "none" when no user sort is active', () => {
    render(
      <Table columns={columns} data={[]}>
        <Table.SortBreadcrumb />
      </Table>,
    );

    expect(screen.getByText('none')).toBeInTheDocument();
  });

  it('should display the sorted column label when sorting is applied', () => {
    render(
      <Table
        columns={columns}
        data={[]}
        options={{
          initialState: { sorting: [{ id: 'name', desc: false }] },
        }}
      >
        <Table.SortBreadcrumb />
      </Table>,
    );

    expect(screen.queryByText('none')).not.toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('should show a sort entry in the breadcrumb after the user applies a sort via the column header', async () => {
    const user = userEvent.setup();

    render(
      <Table columns={columns} data={[]}>
        <Table.Root>
          <Table.Head />
        </Table.Root>
        <Table.SortBreadcrumb />
      </Table>,
    );

    expect(
      screen.queryByRole('button', { name: 'sort' }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Name options' }));
    await user.click(screen.getByRole('button', { name: 'Asc' }));

    expect(screen.queryByText('none')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'sort' })).toBeInTheDocument();
  });

  it('should show "none" when the only active sort is the intrinsic sort', () => {
    render(
      <Table
        columns={columns}
        data={[]}
        options={{
          initialState: { sorting: [{ id: 'name', desc: false }] },
          meta: { intrinsicSort: { id: 'name', desc: false } },
        }}
      >
        <Table.SortBreadcrumb />
      </Table>,
    );

    expect(screen.getByText('none')).toBeInTheDocument();
  });
});
