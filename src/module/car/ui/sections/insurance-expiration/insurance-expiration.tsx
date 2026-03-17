import { DateExpirationTable } from '@/car/ui/tables/date-expiration/date-expiration';
import { DashboardSection } from '@/dashboard/ui/section/section';

export function InsuranceExpirationSection() {
  return (
    <DashboardSection>
      <DashboardSection.Heading>Insurance expiration</DashboardSection.Heading>
      <DateExpirationTable
        dateColumn="insurance_expiration"
        label="Insurance"
      />
    </DashboardSection>
  );
}
