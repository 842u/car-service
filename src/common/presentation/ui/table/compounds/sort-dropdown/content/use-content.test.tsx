import type { ColumnDef } from '@tanstack/react-table';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import type { features } from '../../../features';
import { Table } from '../../../table';

type TestRow = {
  name: string;
  createdAt: string;
};

const columns: ColumnDef<typeof features, TestRow>[] = [
  {
    id: 'name',
    accessorKey: 'name',
    enableSorting: true,
    meta: { label: 'Name' },
  },
  {
    id: 'createdAt',
    accessorKey: 'createdAt',
    enableSorting: true,
    meta: { label: 'Created At' },
  },
];

const data: TestRow[] = [
  { name: 'B', createdAt: '2024-01-02' },
  { name: 'A', createdAt: '2024-01-03' },
  { name: 'C', createdAt: '2024-01-01' },
];

function renderTable(
  options?: Parameters<typeof Table<TestRow>>[0]['options'],
) {
  return render(
    <Table columns={columns} data={data} options={options}>
      <Table.Root>
        <Table.Head />
        <Table.Body />
      </Table.Root>
    </Table>,
  );
}

function renderedNames() {
  const [, ...bodyRows] = screen.getAllByRole('row');
  return bodyRows.map((row) => within(row).getAllByRole('cell')[0].textContent);
}

async function pickSort(
  user: ReturnType<typeof userEvent.setup>,
  direction: string,
) {
  await user.click(screen.getByRole('button', { name: 'Name' }));
  await user.click(screen.getByRole('button', { name: direction }));
}

describe('useTableSortDropdownContent', () => {
  it('should reverse the rows when the direction is switched on an already sorted column', async () => {
    const user = userEvent.setup();

    renderTable();

    await pickSort(user, 'Asc');
    expect(renderedNames()).toEqual(['A', 'B', 'C']);

    await pickSort(user, 'Desc');
    expect(renderedNames()).toEqual(['C', 'B', 'A']);

    await pickSort(user, 'Asc');
    expect(renderedNames()).toEqual(['A', 'B', 'C']);
  });

  it('should restore the unsorted order when the sort is reset', async () => {
    const user = userEvent.setup();

    renderTable();

    await pickSort(user, 'Desc');
    expect(renderedNames()).toEqual(['C', 'B', 'A']);

    await pickSort(user, 'Reset');
    expect(renderedNames()).toEqual(['B', 'A', 'C']);
  });

  it('should keep the intrinsic sort last when the direction is switched', async () => {
    const user = userEvent.setup();

    render(
      <Table
        columns={columns}
        data={[
          { name: 'A', createdAt: '2024-01-01' },
          { name: 'B', createdAt: '2024-01-02' },
          { name: 'A', createdAt: '2024-01-03' },
        ]}
        options={{
          initialState: { sorting: [{ id: 'createdAt', desc: true }] },
          meta: { intrinsicSort: { id: 'createdAt', desc: true } },
        }}
      >
        <Table.Root>
          <Table.Head />
          <Table.Body />
        </Table.Root>
      </Table>,
    );

    await pickSort(user, 'Asc');
    await pickSort(user, 'Desc');

    const [, ...bodyRows] = screen.getAllByRole('row');
    expect(
      bodyRows.map((row) =>
        within(row)
          .getAllByRole('cell')
          .map((cell) => cell.textContent)
          .join(' '),
      ),
    ).toEqual(['B 2024-01-02', 'A 2024-01-03', 'A 2024-01-01']);
  });
});
