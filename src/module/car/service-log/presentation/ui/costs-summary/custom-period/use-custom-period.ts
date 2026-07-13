import { useState } from 'react';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { sumServiceLogCosts } from '@/car/service-log/presentation/ui/costs-summary/sum-service-log-costs';
import { parseDateToYyyyMmDd } from '@/lib/utils';

interface UseCustomPeriodCostsSummaryParams {
  serviceLogs?: ServiceLogDto[];
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
    sumServiceLogCosts(serviceLogs, { from: fromDate, to: toDate });

  return { costs, fromDate, setFromDate, toDate, setToDate };
}
