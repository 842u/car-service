'use client';

import { DetailsCard } from '@/car/presentation/ui/cards/details/details';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { Spinner } from '@/ui/decorative/spinner/spinner';

import { SectionControls } from './controls/controls';
import { useDetailsSection } from './use-details';

type DetailsSectionProps = {
  carId: string;
  className?: string;
};

export function DetailsSection({ carId, className }: DetailsSectionProps) {
  const { carData, isCarDataLoading, isSessionUserPrimaryOwner } =
    useDetailsSection({ carId });

  if (isCarDataLoading) {
    return (
      <DashboardSection aria-label="Vehicle details" className={className}>
        <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
      </DashboardSection>
    );
  }

  return (
    <DashboardSection aria-label="Vehicle details" className={className}>
      <DetailsCard car={carData} className="mb-5" />
      <SectionControls canEdit={isSessionUserPrimaryOwner} car={carData} />
    </DashboardSection>
  );
}
