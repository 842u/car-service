'use client';

import type { ServiceLogDto } from '@/car/service-log/application/dto/service-log';
import { AllTimeCostsSummary } from '@/car/service-log/presentation/ui/costs-summary/all-time/all-time';
import { CustomPeriodCostsSummary } from '@/car/service-log/presentation/ui/costs-summary/custom-period/custom-period';
import { PastYearCostsSummary } from '@/car/service-log/presentation/ui/costs-summary/past-year/past-year';
import { sumServiceLogCosts } from '@/car/service-log/presentation/ui/costs-summary/sum-service-log-costs';
import { yearToDateRange } from '@/car/service-log/presentation/ui/costs-summary/year-to-date-range';

interface CostsSummaryProps {
  serviceLogs?: ServiceLogDto[];
}

export function CostsSummary({ serviceLogs }: CostsSummaryProps) {
  const totalCost = serviceLogs ? sumServiceLogCosts(serviceLogs) : undefined;

  const yearToDateCost = serviceLogs
    ? sumServiceLogCosts(serviceLogs, yearToDateRange(new Date()))
    : undefined;

  return (
    <div>
      <div className="flex flex-col gap-5 md:flex-row lg:flex-col">
        <AllTimeCostsSummary costs={totalCost} />
        <PastYearCostsSummary costs={yearToDateCost} />
      </div>

      <CustomPeriodCostsSummary serviceLogs={serviceLogs} />
    </div>
  );
}
