import { DateExpirationTable } from '@/car/ui/tables/date-expiration/date-expiration';
import { DashboardSection } from '@/dashboard/ui/section/section';

export function TechnicalInspectionExpirationSection() {
  return (
    <DashboardSection>
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
