'use client';

import { useMemo } from 'react';

import { ServiceLog } from '@/types';
import { multiCriteriaServiceLogsSortComparator } from '@/utils/supabase/tables/service_logs';

import { CarServiceLogsTableRow } from './CarServiceLogsTableRow';

type CarServiceLogsTableProps = {
  carId: string;
  userId: string;
  isCurrentUserPrimaryOwner: boolean;
  serviceLogs?: ServiceLog[];
  caption?: string;
};

export function CarServiceLogsTable({
  carId,
  userId,
  isCurrentUserPrimaryOwner,
  serviceLogs,
  caption,
}: CarServiceLogsTableProps) {
  const visibleServiceLogs = useMemo(() => {
    if (!serviceLogs) return;

    const sortedServiceLogs = [...serviceLogs];

    sortedServiceLogs.sort((firstLog, secondLog) =>
      multiCriteriaServiceLogsSortComparator(firstLog, secondLog, [
        { key: 'service_date', order: 'descending' },
        { key: 'created_at', order: 'descending' },
      ]),
    );

    return sortedServiceLogs;
  }, [serviceLogs]);

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
          {visibleServiceLogs?.map((serviceLog) => (
            <CarServiceLogsTableRow
              key={serviceLog.id}
              carId={carId}
              isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
              serviceLog={serviceLog}
              userId={userId}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
