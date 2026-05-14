'use client';

import { twMerge } from 'tailwind-merge';

import { useOwnershipsSection } from '@/car/ownership/ui/sections/ownerships/use-ownerships';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { Spinner } from '@/ui/decorative/spinner/spinner';

import { OwnershipsTable } from '../../tables/ownerships/ownerships';
import { SectionControls } from './controls/controls';

interface OwnershipsSectionProps {
  carId: string;
  className?: string;
}

export function OwnershipsSection({
  carId,
  className,
}: OwnershipsSectionProps) {
  const {
    isSessionUserPrimaryOwner,
    ownerships,
    sessionUserId,
    users,
    isLoading,
  } = useOwnershipsSection({ carId });

  if (isLoading) {
    return (
      <DashboardSection className={className}>
        <DashboardSection.Heading headingLevel="h2">
          Ownerships
        </DashboardSection.Heading>
        <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
      </DashboardSection>
    );
  }

  return (
    <DashboardSection className={twMerge('flex flex-col', className)}>
      <DashboardSection.Heading headingLevel="h2">
        Ownerships
      </DashboardSection.Heading>
      <div className="flex-1">
        <OwnershipsTable
          isSessionUserPrimaryOwner={isSessionUserPrimaryOwner}
          ownerships={ownerships}
          sessionUserId={sessionUserId}
          users={users}
        />
      </div>
      <SectionControls canAdd={isSessionUserPrimaryOwner} carId={carId} />
    </DashboardSection>
  );
}
