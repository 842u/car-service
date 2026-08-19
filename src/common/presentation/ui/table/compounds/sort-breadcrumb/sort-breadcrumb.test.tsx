import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { features } from '../../features';
import { Table } from '../../table';

type TestRow = {
  name: string;
};

const columns: ColumnDef<typeof features, TestRow>[] = [
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

    expect(screen.getAllByRole('button', { name: 'Name' })).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Name' }));
    await user.click(screen.getByRole('button', { name: 'Asc' }));

    expect(screen.queryByText('none')).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Name' })).toHaveLength(2);
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
