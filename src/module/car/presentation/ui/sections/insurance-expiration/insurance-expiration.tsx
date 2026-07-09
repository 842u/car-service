import { twMerge } from 'tailwind-merge';

import { DateExpirationTable } from '@/car/presentation/ui/tables/date-expiration/date-expiration';
import { DashboardSection } from '@/dashboard/ui/section/section';

interface InsuranceExpirationSectionProps {
  className?: string;
}

export function InsuranceExpirationSection({
  className,
}: InsuranceExpirationSectionProps) {
  return (
    <DashboardSection className={twMerge('lg:flex lg:flex-col', className)}>
      <DashboardSection.Heading>Insurance expiration</DashboardSection.Heading>
      <DateExpirationTable dateColumn="insuranceExpiration" label="Insurance" />
    </DashboardSection>
  );
}
