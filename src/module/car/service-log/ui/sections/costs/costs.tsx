'use client';

import { useCostsSection } from '@/car/service-log/ui/sections/costs/use-costs';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { inputVariants } from '@/lib/tailwindcss/input';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';

export const FILTERED_COSTS_TEST_ID = 'FILTERED_COSTS_TEST_ID';
export const YEAR_TO_DATE_COSTS_TEST_ID = 'YEAR_TO_DATE_COSTS_TEST_ID';
export const TOTAL_COSTS_TEST_ID = 'TOTAL_COSTS_TEST_ID';

interface CostsSectionProps {
  className?: string;
}

export function CostsSection({ className }: CostsSectionProps) {
  const { data, isPending, fromDate, setFromDate, toDate, setToDate } =
    useCostsSection();

  if (isPending)
    return (
      <DashboardSection className={className}>
        <DashboardSection.Heading headingLevel="h2">
          Costs
        </DashboardSection.Heading>
        <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
      </DashboardSection>
    );

  return (
    <DashboardSection className={className}>
      <DashboardSection.Heading headingLevel="h2">
        Costs
      </DashboardSection.Heading>

      <div className="flex flex-col gap-5 md:flex-row lg:flex-col">
        <div className="md:flex-1">
          <p className="text-alpha-grey-900">ALL TIME COSTS</p>
          <p
            className="overflow-x-auto overflow-y-clip text-7xl"
            data-testid={TOTAL_COSTS_TEST_ID}
          >
            {data?.totalCost ?? 0}
          </p>
        </div>

        <div className="md:flex-1">
          <p className="text-alpha-grey-900">PAST YEAR COSTS</p>
          <p
            className="overflow-x-auto overflow-y-clip text-6xl md:text-7xl lg:text-6xl"
            data-testid={YEAR_TO_DATE_COSTS_TEST_ID}
          >
            {data?.yearToDateCost ?? 0}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <TextSeparator
          className="text-alpha-grey-900 mt-5"
          text="CUSTOM PERIOD"
        />

        <div className="flex flex-col gap-2 md:flex-row md:gap-5">
          <label className="flex-1">
            <p className="text-alpha-grey-900">From</p>
            <input
              className={inputVariants.default}
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </label>

          <label className="flex-1">
            <p className="text-alpha-grey-900">To</p>
            <input
              className={inputVariants.default}
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
            />
          </label>
        </div>

        <div>
          <p
            className="text-alpha-grey-900"
            data-testid={FILTERED_COSTS_TEST_ID}
          >
            PERIOD TOTAL COSTS
          </p>
          <p className="overflow-x-auto overflow-y-clip text-6xl">
            {data?.filteredCost ?? 0}
          </p>
        </div>
      </div>
    </DashboardSection>
  );
}
