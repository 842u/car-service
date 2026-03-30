import { useState } from 'react';

import { parseDateToYyyyMmDd } from '@/lib/utils';
import type { ServiceLog } from '@/types';

interface UseCustomPeriodCostsSummaryParams {
  serviceLogs?: ServiceLog[];
}

export function useCustomPeriodCostsSummary({
  serviceLogs,
}: UseCustomPeriodCostsSummaryParams) {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [fromDate, setFromDate] = useState<string>(
    parseDateToYyyyMmDd(firstDayOfMonth),
  );
  const [toDate, setToDate] = useState<string>(parseDateToYyyyMmDd(today));

  const costs =
    serviceLogs &&
    serviceLogs
      .filter(
        (log) => log.service_date >= fromDate && log.service_date <= toDate,
      )
      .reduce((sum, log) => sum + (log.service_cost ?? 0), 0);

  return { costs, fromDate, setFromDate, toDate, setToDate };
}
