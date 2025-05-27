import { ServiceLog } from '@/types';

import { CarServiceLogsTableRow } from './CarServiceLogsTableRow';

type CarServiceLogsTableProps = {
  carId: string;
  serviceLogs?: ServiceLog[];
  caption?: string;
};

export function CarServiceLogsTable({
  carId,
  serviceLogs,
  caption,
}: CarServiceLogsTableProps) {
  return (
    <div className="my-4 max-h-80 overflow-auto">
      <table className="w-full">
        <caption className="caption-bottom p-2">{caption}</caption>
        <thead className="h-10">
          <tr className="border-alpha-grey-300 border-b">
            <th className="p-2 text-start">Date</th>
            <th className="p-2 text-start">Category</th>
            <th className="p-2 text-start">Mileage</th>
            <th className="p-2 text-start">Cost</th>
            <th className="p-2 text-start">Notes</th>
            <th className="p-2 text-start">Actions</th>
          </tr>
        </thead>
        <tbody>
          {serviceLogs?.map((serviceLog) => (
            <CarServiceLogsTableRow
              key={serviceLog.id}
              carId={carId}
              serviceLog={serviceLog}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
