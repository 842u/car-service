'use client';

import { TotalOwnershipsSection } from '@/car/ownership/ui/sections/total-ownerships/total-ownerships';
import { CostsSection } from '@/car/service-log/ui/sections/costs/costs';
import { InsuranceExpirationSection } from '@/car/ui/sections/insurance-expiration/insurance-expiration';
import { TechnicalInspectionExpirationSection } from '@/car/ui/sections/technical-inspection-expiration/technical-inspection-expiration';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { useOverviewSection } from '@/dashboard/ui/sections/overview/use-overview';

export function OverviewSection() {
  const { data } = useOverviewSection();

  return (
    <DashboardSection
      className="self-stretch border-0 lg:flex lg:flex-col lg:items-center lg:justify-center"
      variant="transparent"
    >
      <DashboardSection.Heading className="self-start text-3xl">
        Overview
      </DashboardSection.Heading>
      <div className="lg:flex lg:grow lg:flex-col lg:items-center lg:justify-center">
        <div className="flex flex-col gap-5 lg:grid lg:grid-cols-6">
          <TotalOwnershipsSection
            className="lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-1"
            ownerId={data?.id || ''}
          />
          <InsuranceExpirationSection className="lg:col-start-3 lg:col-end-7 lg:row-start-1 lg:row-end-1" />
          <TechnicalInspectionExpirationSection className="lg:col-start-1 lg:col-end-5 lg:row-start-2 lg:row-end-2" />
          <CostsSection className="lg:col-start-5 lg:col-end-7 lg:row-start-2 lg:row-end-2" />
        </div>
      </div>
    </DashboardSection>
  );
}
