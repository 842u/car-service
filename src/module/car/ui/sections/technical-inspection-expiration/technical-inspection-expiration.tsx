import { twMerge } from 'tailwind-merge';

import { DateExpirationTable } from '@/car/ui/tables/date-expiration/date-expiration';
import { DashboardSection } from '@/dashboard/ui/section/section';

interface TechnicalInspectionExpirationSectionProps {
  className?: string;
}

export function TechnicalInspectionExpirationSection({
  className,
}: TechnicalInspectionExpirationSectionProps) {
  return (
    <DashboardSection className={twMerge('lg:flex lg:flex-col', className)}>
      <DashboardSection.Heading>
        Technical inspection expiration
      </DashboardSection.Heading>
      <div className="lg:flex lg:grow lg:flex-col lg:justify-center">
        <DateExpirationTable
          dateColumn="technical_inspection_expiration"
          label="Technical inspection"
        />
      </div>
    </DashboardSection>
  );
}
