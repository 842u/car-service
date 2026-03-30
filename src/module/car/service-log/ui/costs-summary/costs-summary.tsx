'use client';

import { AllTimeCostsSummary } from '@/car/service-log/ui/costs-summary/all-time/all-time';
import { CustomPeriodCostsSummary } from '@/car/service-log/ui/costs-summary/custom-period/custom-period';
import { PastYearCostsSummary } from '@/car/service-log/ui/costs-summary/past-year/past-year';
import { useCostsSummary } from '@/car/service-log/ui/costs-summary/use-costs-summary';
import type { ServiceLog } from '@/types';

interface CostsSummaryProps {
  serviceLogs?: ServiceLog[];
}

export function CostsSummary({ serviceLogs }: CostsSummaryProps) {
  const { summary } = useCostsSummary({ serviceLogs });

  return (
    <>
      <div className="flex flex-col gap-5 md:flex-row lg:flex-col">
        <AllTimeCostsSummary costs={summary?.totalCost} />
        <PastYearCostsSummary costs={summary?.yearToDateCost} />
      </div>

      <CustomPeriodCostsSummary serviceLogs={serviceLogs} />
    </>
  );
}
