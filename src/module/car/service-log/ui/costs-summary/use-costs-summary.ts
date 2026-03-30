import { useMemo } from 'react';

import { parseDateToYyyyMmDd } from '@/lib/utils';
import type { ServiceLog } from '@/types';

interface UseCostsSectionParams {
  serviceLogs?: ServiceLog[];
}

export function useCostsSummary({ serviceLogs }: UseCostsSectionParams) {
  const today = new Date();
  const oneYearAgo = new Date(today);
  oneYearAgo.setFullYear(today.getFullYear() - 1);

  const todayStr = parseDateToYyyyMmDd(today);
  const oneYearAgoStr = parseDateToYyyyMmDd(oneYearAgo);

  const summary = useMemo(() => {
    if (!serviceLogs) return undefined;
    const totalCost = serviceLogs.reduce(
      (sum, log) => sum + (log.service_cost ?? 0),
      0,
    );

    const yearToDateCost = serviceLogs
      .filter(
        (log) =>
          log.service_date >= oneYearAgoStr && log.service_date <= todayStr,
      )
      .reduce((sum, log) => sum + (log.service_cost ?? 0), 0);

    return { totalCost, yearToDateCost };
  }, [serviceLogs, oneYearAgoStr, todayStr]);

  return { summary };
}
