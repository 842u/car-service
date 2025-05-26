import { PencilIcon } from '@/components/decorative/icons/PencilIcon';
import { TrashIcon } from '@/components/decorative/icons/TrashIcon';
import { ServiceLog } from '@/types';

import { IconButton } from '../../shared/IconButton/IconButton';

type CarServiceLogsTableProps = {
  serviceLogs?: ServiceLog[];
  caption?: string;
};

export function CarServiceLogsTable({
  serviceLogs,
  caption,
}: CarServiceLogsTableProps) {
  return (
    <div className="my-4 max-h-80 overflow-auto">
      <table>
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
            <tr
              key={serviceLog.id}
              className="border-alpha-grey-300 border-b first-of-type:border-t-0 last-of-type:border-b-0"
            >
              <td className="p-2 whitespace-nowrap">
                {serviceLog.service_date}
              </td>
              <td className="p-2">{serviceLog.category}</td>
              <td className="max-w-16 overflow-auto p-2 lg:max-w-fit">
                {serviceLog.mileage}
              </td>
              <td className="max-w-16 overflow-auto p-2 lg:max-w-fit">
                {serviceLog.service_cost}
              </td>
              <td className="p-2">
                <p className="max-h-16 min-w-48 overflow-y-auto">
                  {serviceLog.notes}
                </p>
              </td>
              <td className="p-2">
                <div className="flex w-auto gap-4">
                  <IconButton title="edit log" variant="accent">
                    <PencilIcon className="min-h-full min-w-full stroke-2" />
                  </IconButton>
                  <IconButton title="delete log" variant="accent">
                    <TrashIcon className="min-h-full min-w-full stroke-2" />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
