import { OwnershipsSection } from '@/car/ownership/ui/sections/ownerships/ownerships';
import { CarCostsSection } from '@/car/service-log/ui/sections/car-costs/car-costs';
import { ServiceLogsSection } from '@/car/service-log/ui/sections/service-logs/service-logs';
import { DetailsSection } from '@/car/ui/sections/details/details';
import { DashboardSection } from '@/dashboard/ui/section/section';

import { DeleteSection } from '../delete/delete';

interface OverviewSectionProps {
  carId: string;
}

export function OverviewSection({ carId }: OverviewSectionProps) {
  return (
    <DashboardSection
      className="flex flex-col gap-5 lg:grid lg:max-w-7xl lg:grid-cols-[auto_1fr_auto] lg:gap-5"
      variant="raw"
    >
      <DetailsSection carId={carId} className="lg:col-span-3 lg:w-auto" />
      <ServiceLogsSection carId={carId} className="lg:col-span-3" />
      <OwnershipsSection carId={carId} className="lg:col-span-2 lg:min-w-fit" />
      <CarCostsSection carId={carId} className="lg:col-span-1 lg:max-w-md" />
      <DeleteSection carId={carId} className="lg:col-span-3" />
    </DashboardSection>
  );
}
