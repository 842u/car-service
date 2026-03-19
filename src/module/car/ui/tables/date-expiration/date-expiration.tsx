'use client';

import { DateExpirationTableLegend } from '@/car/ui/tables/date-expiration/legend/legend';
import { useDateExpirationTable } from '@/car/ui/tables/date-expiration/use-date-expiration';
import type { Car } from '@/types';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import { Table } from '@/ui/table/table';

interface DateExpirationTableProps {
  label: string;
  dateColumn: keyof Pick<
    Car,
    'created_at' | 'insurance_expiration' | 'technical_inspection_expiration'
  >;
}

export function DateExpirationTable({
  label,
  dateColumn,
}: DateExpirationTableProps) {
  const { columns, data, isPending, intersectionTargetRef } =
    useDateExpirationTable({ label, dateColumn });

  if (isPending)
    return (
      <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
    );

  return (
    <Table columns={columns} data={data}>
      <Table.Root className="max-h-72 overflow-y-auto">
        <Table.Head className="h-12" />
        <Table.Body lastRowRef={intersectionTargetRef} />
      </Table.Root>
      <DateExpirationTableLegend />
    </Table>
  );
}
