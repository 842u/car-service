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
    <DashboardSection className="self-stretch border-0" variant="transparent">
      <DashboardSection.Heading className="text-3xl">
        Overview
      </DashboardSection.Heading>
      <div>
        <TotalOwnershipsSection ownerId={data?.id || ''} />
        <InsuranceExpirationSection />
        <TechnicalInspectionExpirationSection />
        <CostsSection />
      </div>
    </DashboardSection>
  );
}
