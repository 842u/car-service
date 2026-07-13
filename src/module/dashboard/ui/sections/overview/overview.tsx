import { TotalOwnershipsSection } from '@/car/ownership/presentation/ui/sections/total-ownerships/total-ownerships';
import { InsuranceExpirationSection } from '@/car/presentation/ui/sections/insurance-expiration/insurance-expiration';
import { TechnicalInspectionExpirationSection } from '@/car/presentation/ui/sections/technical-inspection-expiration/technical-inspection-expiration';
import { CostsSection } from '@/car/service-log/ui/sections/costs/costs';
import { DashboardSection } from '@/dashboard/ui/section/section';

export function OverviewSection() {
  return (
    <DashboardSection
      className="lg:flex lg:flex-col lg:self-stretch"
      variant="raw"
    >
      <DashboardSection.Heading>Overview</DashboardSection.Heading>
      <div className="lg:mx-auto lg:flex lg:w-full lg:max-w-7xl lg:grow lg:items-center lg:justify-center">
        <div className="flex flex-col gap-5 lg:grid lg:w-full lg:grid-cols-[auto_1fr_auto]">
          <TotalOwnershipsSection className="lg:col-span-1 lg:min-w-xs" />
          <InsuranceExpirationSection className="lg:col-span-2" />
          <TechnicalInspectionExpirationSection className="lg:col-span-2 lg:min-w-fit" />
          <CostsSection className="lg:col-span-1 lg:max-w-md" />
        </div>
      </div>
    </DashboardSection>
  );
}
