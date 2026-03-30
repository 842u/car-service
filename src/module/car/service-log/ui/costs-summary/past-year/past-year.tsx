export const YEAR_TO_DATE_COSTS_TEST_ID = 'YEAR_TO_DATE_COSTS_TEST_ID';

interface PastYearCostsSummaryProps {
  costs?: number;
}

export function PastYearCostsSummary({ costs }: PastYearCostsSummaryProps) {
  return (
    <div className="md:flex-1">
      <p className="text-alpha-grey-900">PAST YEAR COSTS</p>
      <p
        className="overflow-x-auto overflow-y-clip text-6xl md:text-7xl lg:text-6xl"
        data-testid={YEAR_TO_DATE_COSTS_TEST_ID}
      >
        {costs ?? 0}
      </p>
    </div>
  );
}
