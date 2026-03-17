import { useDateExpirationTable } from '@/car/ui/tables/date-expiration/use-date-expiration';
import { CheckCircleIcon } from '@/icons/check-circle';
import { ExclamationCircleIcon } from '@/icons/exclamation-circle';
import { ExclamationTriangleIcon } from '@/icons/exclamation-triangle';
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
      <Table.Root className="max-h-56 overflow-y-scroll">
        <Table.Head className="h-12" />
        <Table.Body lastRowRef={intersectionTargetRef} />
      </Table.Root>
      <div className="m-6 flex gap-6 text-sm">
        <div className="flex items-center gap-1">
          <CheckCircleIcon className="stroke-success-500 h-4 stroke-2" />
          Valid
        </div>

        <div className="flex items-center gap-1">
          <ExclamationCircleIcon className="stroke-warning-500 h-4 stroke-2" />
          Expires soon
        </div>

        <div className="flex items-center gap-1">
          <ExclamationTriangleIcon className="stroke-error-500 h-4 stroke-2" />
          Expired
        </div>
      </div>
    </Table>
  );
}
