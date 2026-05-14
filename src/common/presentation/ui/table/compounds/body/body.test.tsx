import type { ColumnDef } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';

import { Table } from '../../table';

interface TestRow {
  name: string;
}

const columns: ColumnDef<TestRow>[] = [
  { id: 'name', accessorKey: 'name', meta: { label: 'Name' } },
];

const data: TestRow[] = [
  { name: 'Toyota' },
  { name: 'BMW' },
  { name: 'Honda' },
];

function renderBody(tableData: TestRow[] = data) {
  return render(
    <Table columns={columns} data={tableData}>
      <Table.Root>
        <Table.Body />
      </Table.Root>
    </Table>,
  );
}

describe('TableBody', () => {
  it('should render a row for each data item', () => {
    renderBody();

    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('BMW')).toBeInTheDocument();
    expect(screen.getByText('Honda')).toBeInTheDocument();
  });

  it('should show the empty state placeholder when data is empty', () => {
    renderBody([]);

    expect(screen.getByText('No matching results')).toBeInTheDocument();
  });

  it('should attach lastRowRef to the last rendered row', () => {
    const ref = createRef<HTMLTableRowElement>();

    render(
      <Table columns={columns} data={data}>
        <Table.Root>
          <Table.Body lastRowRef={ref} />
        </Table.Root>
      </Table>,
    );

    const rows = screen.getAllByRole('row');
    expect(ref.current).toBe(rows[rows.length - 1]);
  });
});
