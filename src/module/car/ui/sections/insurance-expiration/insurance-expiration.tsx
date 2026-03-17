import { InsuranceExpirationTable } from '@/car/ui/tables/insurance-expiration/insurance-expiration';
import { DashboardSection } from '@/dashboard/ui/section/section';

export function InsuranceExpirationSection() {
  return (
    <DashboardSection>
      <DashboardSection.Heading>Insurance expiration</DashboardSection.Heading>
      <InsuranceExpirationTable />
    </DashboardSection>
  );
}
