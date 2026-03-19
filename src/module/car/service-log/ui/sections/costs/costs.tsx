'use client';

import { useCostsSection } from '@/car/service-log/ui/sections/costs/use-costs';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { inputVariants } from '@/lib/tailwindcss/input';
import { Spinner } from '@/ui/decorative/spinner/spinner';

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

      <div className="md:flex">
        <DashboardSection variant="raw">
          <DashboardSection.Heading
            className="text-alpha-grey-900 font-normal"
            headingLevel="h3"
            withUnderline={false}
          >
            All time costs
          </DashboardSection.Heading>
          <DashboardSection.Text className="text-5xl">
            {data?.totalCost ?? 0}
          </DashboardSection.Text>
        </DashboardSection>

        <DashboardSection variant="raw">
          <DashboardSection.Heading
            className="text-alpha-grey-900 font-normal"
            headingLevel="h3"
            withUnderline={false}
          >
            Past year costs
          </DashboardSection.Heading>
          <DashboardSection.Text className="text-5xl">
            {data?.yearToDateCost ?? 0}
          </DashboardSection.Text>
        </DashboardSection>
      </div>

      <DashboardSection className="flex flex-col gap-2" variant="raw">
        <DashboardSection.Heading
          className="text-alpha-grey-900 font-normal"
          headingLevel="h3"
        >
          Custom period
        </DashboardSection.Heading>

        <div className="md:flex md:gap-5">
          <label className="md:w-full">
            <p className="my-2 text-xs">From</p>
            <input
              className={inputVariants.default}
              type="date"
              value={fromDate}
              onChange={(event) => setFromDate(event.target.value)}
            />
          </label>

          <label className="md:w-full">
            <p className="my-2 text-xs">To</p>
            <input
              className={inputVariants.default}
              type="date"
              value={toDate}
              onChange={(event) => setToDate(event.target.value)}
            />
          </label>
        </div>

        <DashboardSection.Text className="text-alpha-grey-900 self-end text-base">
          Period total costs
        </DashboardSection.Text>
        <DashboardSection.Text className="self-end text-5xl">
          {data?.filteredCost ?? 0}
        </DashboardSection.Text>
      </DashboardSection>
    </DashboardSection>
  );
}
