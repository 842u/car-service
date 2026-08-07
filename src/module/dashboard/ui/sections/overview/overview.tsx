import { TotalOwnershipsSection } from '@/car/ownership/presentation/ui/sections/total-ownerships/total-ownerships';
import { InsuranceExpirationSection } from '@/car/presentation/ui/sections/insurance-expiration/insurance-expiration';
import { TechnicalInspectionExpirationSection } from '@/car/presentation/ui/sections/technical-inspection-expiration/technical-inspection-expiration';
import { CostsSection } from '@/car/service-log/presentation/ui/sections/costs/costs';
import { SectionHeading } from '@/dashboard/ui/section/compounds/heading/heading';
import { DashboardSection } from '@/dashboard/ui/section/section';

export function OverviewSection() {
  return (
    <DashboardSection
      className="lg:flex lg:flex-col lg:self-stretch"
      variant="raw"
    >
      <SectionHeading headingLevel="h1">Overview</SectionHeading>
      <div className="lg:mx-auto lg:flex lg:w-full lg:max-w-7xl lg:grow lg:items-center lg:justify-center-safe">
        {/*
          `min-w-0` because this is a flex item of the row above: a flex item's
          automatic minimum size floors it at its content's min-content width,
          which for `whitespace-nowrap` table cells is a whole table row. That
          floor would push the grid past the viewport instead of letting the
          tables scroll. The sections inside carry the same, from
          `sectionVariants`, since grid items get the floor too.
        */}
        <div className="flex min-w-0 flex-col gap-5 lg:grid lg:w-full lg:grid-cols-[auto_1fr_auto]">
          <TotalOwnershipsSection className="lg:col-span-1 lg:min-w-xs" />
          <InsuranceExpirationSection className="lg:col-span-2" />
          <TechnicalInspectionExpirationSection className="lg:col-span-2" />
          <CostsSection className="lg:col-span-1 lg:max-w-md" />
        </div>
      </div>
    </DashboardSection>
  );
}
