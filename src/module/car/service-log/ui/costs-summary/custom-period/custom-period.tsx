import { useCustomPeriodCostsSummary } from '@/car/service-log/ui/costs-summary/custom-period/use-custom-period';
import { inputVariants } from '@/lib/tailwindcss/input';
import type { ServiceLog } from '@/types';
import { TextSeparator } from '@/ui/decorative/text-separator/text-separator';

export const FILTERED_COSTS_TEST_ID = 'FILTERED_COSTS_TEST_ID';

interface CustomPeriodCostsSummaryProps {
  serviceLogs?: ServiceLog[];
}

export function CustomPeriodCostsSummary({
  serviceLogs,
}: CustomPeriodCostsSummaryProps) {
  const { costs, fromDate, setFromDate, toDate, setToDate } =
    useCustomPeriodCostsSummary({ serviceLogs });

  return (
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
        <p className="text-alpha-grey-900" data-testid={FILTERED_COSTS_TEST_ID}>
          PERIOD TOTAL COSTS
        </p>
        <p className="overflow-x-auto overflow-y-clip text-6xl">{costs ?? 0}</p>
      </div>
    </div>
  );
}
