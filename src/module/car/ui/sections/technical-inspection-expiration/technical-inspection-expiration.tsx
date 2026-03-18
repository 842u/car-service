import { DateExpirationTable } from '@/car/ui/tables/date-expiration/date-expiration';
import { DashboardSection } from '@/dashboard/ui/section/section';

interface TechnicalInspectionExpirationSectionProps {
  className?: string;
}

export function TechnicalInspectionExpirationSection({
  className,
}: TechnicalInspectionExpirationSectionProps) {
  return (
    <DashboardSection className={className}>
      <DashboardSection.Heading>
        Technical inspection expiration
      </DashboardSection.Heading>
      <DateExpirationTable
        dateColumn="technical_inspection_expiration"
        label="Technical inspection"
      />
    </DashboardSection>
  );
}
