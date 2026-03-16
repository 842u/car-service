import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { getServiceLogsWithCost } from '@/lib/supabase/tables/service_logs';
import { queryKeys } from '@/lib/tanstack/keys';
import { parseDateToYyyyMmDd } from '@/lib/utils';

export function useCostsSection() {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const [fromDate, setFromDate] = useState<string>(
    parseDateToYyyyMmDd(firstDayOfMonth),
  );
  const [toDate, setToDate] = useState<string>(parseDateToYyyyMmDd(today));

  const { addToast } = useToasts();

  const { data, isError, error, isPending } = useQuery({
    queryKey: queryKeys.serviceLogsWithCost,
    queryFn: getServiceLogsWithCost,
    select: (serviceLogs) => {
      const totalCost = serviceLogs.reduce(
        (sum, log) => sum + (log.service_cost ?? 0),
        0,
      );

      const yearToDateCost = serviceLogs
        .filter(
          (log) =>
            new Date(log.service_date) >= oneYearAgo &&
            new Date(log.service_date) <= today,
        )
        .reduce((sum, log) => sum + (log.service_cost ?? 0), 0);

      const filteredCost = serviceLogs
        .filter(
          (log) =>
            new Date(log.service_date) >= new Date(fromDate!) &&
            new Date(log.service_date) <= new Date(toDate!),
        )
        .reduce((sum, log) => sum + (log.service_cost ?? 0), 0);

      return { totalCost, yearToDateCost, filteredCost };
    },
  });

  useEffect(() => {
    isError &&
      addToast(error?.message || 'Cannot get service logs costs.', 'error');
  }, [isError, error, addToast]);

  return { data, isPending, fromDate, setFromDate, toDate, setToDate };
}
