'use client';

import { CostsSummary } from '@/car/service-log/presentation/ui/costs-summary/costs-summary';
import { useCarCostsSection } from '@/car/service-log/presentation/ui/sections/car-costs/use-car-costs';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { Spinner } from '@/ui/decorative/spinner/spinner';

const headingId = 'car-costs-heading';

type CarCostsSectionProps = {
  carId: string;
  className?: string;
};

export function CarCostsSection({ carId, className }: CarCostsSectionProps) {
  const { serviceLogs, isPending } = useCarCostsSection({
    carId,
  });

  return (
    <DashboardSection aria-labelledby={headingId} className={className}>
      <DashboardSection.Heading headingLevel="h2" id={headingId}>
        Costs
      </DashboardSection.Heading>
      {isPending ? (
        <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-72" />
      ) : (
        <CostsSummary serviceLogs={serviceLogs} />
      )}
    </DashboardSection>
  );
}
