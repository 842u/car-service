import { DateExpirationTable } from '@/car/ui/tables/date-expiration/date-expiration';
import { DashboardSection } from '@/dashboard/ui/section/section';

interface InsuranceExpirationSectionProps {
  className?: string;
}

export function InsuranceExpirationSection({
  className,
}: InsuranceExpirationSectionProps) {
  return (
    <DashboardSection className={className}>
      <DashboardSection.Heading>Insurance expiration</DashboardSection.Heading>
      <DateExpirationTable
        dateColumn="insurance_expiration"
        label="Insurance"
      />
    </DashboardSection>
  );
}
