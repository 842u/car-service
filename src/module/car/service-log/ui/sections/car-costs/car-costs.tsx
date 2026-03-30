'use client';

import { CostsSummary } from '@/car/service-log/ui/costs-summary/costs-summary';
import { useCarCostsSection } from '@/car/service-log/ui/sections/car-costs/use-car-costs';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { Spinner } from '@/ui/decorative/spinner/spinner';

interface CarCostsSectionProps {
  carId: string;
  className?: string;
}

export function CarCostsSection({ carId, className }: CarCostsSectionProps) {
  const { serviceLogs, isPending } = useCarCostsSection({
    carId,
  });

  return (
    <DashboardSection className={className}>
      <DashboardSection.Heading headingLevel="h2">
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
