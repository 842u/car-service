import { twMerge } from 'tailwind-merge';

import { DateExpirationTable } from '@/car/presentation/ui/tables/date-expiration/date-expiration';
import { SectionHeading } from '@/dashboard/ui/section/compounds/heading/heading';
import { DashboardSection } from '@/dashboard/ui/section/section';

type TechnicalInspectionExpirationSectionProps = {
  className?: string;
};

export function TechnicalInspectionExpirationSection({
  className,
}: TechnicalInspectionExpirationSectionProps) {
  return (
    <DashboardSection className={twMerge('lg:flex lg:flex-col', className)}>
      <SectionHeading headingLevel="h2">
        Technical inspection expiration
      </SectionHeading>
      <div className="lg:flex lg:grow lg:flex-col lg:justify-center">
        <DateExpirationTable
          dateColumn="technicalInspectionExpiration"
          label="Technical inspection"
        />
      </div>
    </DashboardSection>
  );
}
