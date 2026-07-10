'use client';

import type { CarDto } from '@/car/application/dto/car';
import { DateExpirationTableLegend } from '@/car/presentation/ui/tables/date-expiration/legend/legend';
import { DateExpirationTablePlaceholder } from '@/car/presentation/ui/tables/date-expiration/placeholder/placeholder';
import { useDateExpirationTable } from '@/car/presentation/ui/tables/date-expiration/use-date-expiration';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import { Table } from '@/ui/table/table';

interface DateExpirationTableProps {
  label: string;
  dateColumn: keyof Pick<
    CarDto,
    'createdAt' | 'insuranceExpiration' | 'technicalInspectionExpiration'
  >;
}

export function DateExpirationTable({
  label,
  dateColumn,
}: DateExpirationTableProps) {
  const { columns, data, isLoading, intersectionTargetRef } =
    useDateExpirationTable({ label, dateColumn });

  if (isLoading)
    return (
      <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
    );

  if (!data || !data.length) {
    return <DateExpirationTablePlaceholder label={label.toLowerCase()} />;
  }

  return (
    <Table columns={columns} data={data}>
      <div className="flex grow flex-col justify-between">
        <Table.Root className="max-h-96 overflow-y-auto lg:max-h-80">
          <Table.Head className="h-12" />
          <Table.Body lastRowRef={intersectionTargetRef} />
        </Table.Root>
        <DateExpirationTableLegend />
      </div>
    </Table>
  );
}
