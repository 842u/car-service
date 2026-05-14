import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Table } from '../../table';

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

const data: TestRow[] = [
  { status: 'active' },
  { status: 'inactive' },
  { status: 'active' },
];

const checkboxMapping = { Active: 'active', Inactive: 'inactive' };

describe('TableValuesFilter', () => {
  it('should render a trigger button labeled with the column name', () => {
    render(
      <Table columns={columns} data={data}>
        <Table.ValuesFilter
          checkboxLabelValueMapping={checkboxMapping}
          columnId="status"
        />
      </Table>,
    );

    expect(
      screen.getByRole('button', { name: 'Filter by Status' }),
    ).toBeInTheDocument();
  });

  it('should reveal a checkbox for each option after clicking the trigger', async () => {
    const user = userEvent.setup();

    render(
      <Table columns={columns} data={data}>
        <Table.ValuesFilter
          checkboxLabelValueMapping={checkboxMapping}
          columnId="status"
        />
      </Table>,
    );

    await user.click(screen.getByRole('button', { name: 'Filter by Status' }));

    expect(
      screen.getByRole('checkbox', { name: 'Active' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('checkbox', { name: 'Inactive' }),
    ).toBeInTheDocument();
  });

  it('should filter rows to only the selected value', async () => {
    const user = userEvent.setup();

    render(
      <Table columns={columns} data={data}>
        <Table.ValuesFilter
          checkboxLabelValueMapping={checkboxMapping}
          columnId="status"
        />
        <Table.Root>
          <Table.Body />
        </Table.Root>
      </Table>,
    );

    await user.click(screen.getByRole('button', { name: 'Filter by Status' }));
    await user.click(screen.getByRole('checkbox', { name: 'Active' }));

    expect(screen.getAllByText('active')).toHaveLength(2);
    expect(screen.queryByText('inactive')).not.toBeInTheDocument();
  });

  it('should clear the filter when "All" is clicked while some values are selected', async () => {
    const user = userEvent.setup();

    render(
      <Table columns={columns} data={data}>
        <Table.ValuesFilter
          checkboxLabelValueMapping={checkboxMapping}
          columnId="status"
        />
        <Table.Root>
          <Table.Body />
        </Table.Root>
      </Table>,
    );

    await user.click(screen.getByRole('button', { name: 'Filter by Status' }));
    await user.click(screen.getByRole('checkbox', { name: 'Active' }));
    expect(screen.queryByText('inactive')).not.toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: 'All' }));

    expect(screen.getAllByText('active')).toHaveLength(2);
    expect(screen.getByText('inactive')).toBeInTheDocument();
  });
});
