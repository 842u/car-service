import { twMerge } from 'tailwind-merge';

import { DateExpirationTable } from '@/car/presentation/ui/tables/date-expiration/date-expiration';
import { SectionHeading } from '@/dashboard/ui/section/compounds/heading/heading';
import { DashboardSection } from '@/dashboard/ui/section/section';

type InsuranceExpirationSectionProps = {
  className?: string;
};

export function InsuranceExpirationSection({
  className,
}: InsuranceExpirationSectionProps) {
  return (
    <DashboardSection className={twMerge('lg:flex lg:flex-col', className)}>
      <SectionHeading headingLevel="h2">Insurance expiration</SectionHeading>
      <DateExpirationTable dateColumn="insuranceExpiration" label="Insurance" />
    </DashboardSection>
  );
}
