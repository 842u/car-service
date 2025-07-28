'use client';

import { CarServiceLogsSection } from '../../../../components/ui/sections/CarServiceLogsSection/CarServiceLogsSection';
import { CarOwnershipsSection } from '../../ownership/ui/CarOwnershipsSection/CarOwnershipsSection';
import { CarDeleteSection } from '../CarDeleteSection/CarDeleteSection';
import { CarDetailsSection } from '../CarDetailsSection/CarDetailsSection';
import { CarIdentitySection } from '../CarIdentitySection/CarIdentitySection';
import { useCarSettingsSection } from './useCarSettingsSection';

export type CarSettingsSectionProps = {
  carId: string;
};

export function CarSettingsSection({ carId }: CarSettingsSectionProps) {
  const {
    carData,
    isPending,
    isCurrentUserPrimaryOwner,
    carOwnershipData,
    ownersProfilesData,
  } = useCarSettingsSection({ carId });

  return (
    <section className="flex w-full flex-col gap-5 p-5">
      <CarIdentitySection
        imageUrl={carData?.image_url}
        isPending={isPending}
        name={carData?.custom_name}
      />
      <CarDetailsSection
        carData={carData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
      <CarServiceLogsSection
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        ownersProfiles={ownersProfilesData}
      />
      <CarOwnershipsSection
        carId={carId}
        carOwnerships={carOwnershipData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        ownersProfiles={ownersProfilesData}
      />
      <CarDeleteSection
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </section>
  );
}
