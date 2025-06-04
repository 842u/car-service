'use client';

import { CarContextProvider } from '@/components/providers/CarContextProvider';

import { CarDeleteSection } from '../CarDeleteSection/CarDeleteSection';
import { CarDetailsSection } from '../CarDetailsSection/CarDetailsSection';
import { CarIdentitySection } from '../CarIdentitySection/CarIdentitySection';
import { CarOwnershipSection } from '../CarOwnershipSection/CarOwnershipSection';
import { CarServiceLogsSection } from '../CarServiceLogsSection/CarServiceLogsSection';
import { useCarSettingsSection } from './useCarSettingsSection';

export type CarSettingsSectionProps = {
  carId: string;
};

export function CarSettingsSection({ carId }: CarSettingsSectionProps) {
  const {
    isCurrentUserPrimaryOwner,
    carOwnershipData,
    ownersProfilesData,
    sessionProfileData,
  } = useCarSettingsSection({ carId });

  return (
    <CarContextProvider carId={carId}>
      <section className="flex w-full flex-col gap-5 p-5">
        <CarIdentitySection />
        <CarDetailsSection
          isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        />
        <CarServiceLogsSection carId={carId} />
        <CarOwnershipSection
          carId={carId}
          carOwnershipData={carOwnershipData}
          isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
          ownersProfilesData={ownersProfilesData}
          sessionProfileData={sessionProfileData}
        />
        <CarDeleteSection
          carId={carId}
          isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        />
      </section>
    </CarContextProvider>
  );
}
