export const TOTAL_COSTS_TEST_ID = 'TOTAL_COSTS_TEST_ID';

interface AllTimeCostsSummaryProps {
  costs?: number;
}

export function AllTimeCostsSummary({ costs }: AllTimeCostsSummaryProps) {
  return (
    <div className="md:flex-1">
      <p className="text-alpha-grey-900">ALL TIME COSTS</p>
      <p
        className="overflow-x-auto overflow-y-clip text-7xl"
        data-testid={TOTAL_COSTS_TEST_ID}
      >
        {costs ?? 0}
      </p>
    </div>
  );
}
