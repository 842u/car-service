'use client';

import { OwnershipsSection } from '@/car/ownership/ui/sections/ownerships/ownerships';
import { ServiceLogsSection } from '@/car/service-log/ui/sections/service-logs/service-logs';

import { DeleteSection } from '../delete/delete';
import { DetailsSection } from '../details/details';
import { IdentitySection } from '../identity/identity';
import { useCarSettingsSection } from './use-car-settings-section';

export type SettingsSectionProps = {
  carId: string;
};

export function SettingsSection({ carId }: SettingsSectionProps) {
  const {
    carData,
    isPending,
    isCurrentUserPrimaryOwner,
    carOwnershipData,
    ownersProfilesData,
  } = useCarSettingsSection({ carId });

  return (
    <section className="flex w-full flex-col gap-5 p-5">
      <IdentitySection
        imageUrl={carData?.image_url}
        isPending={isPending}
        name={carData?.custom_name}
      />
      <DetailsSection
        carData={carData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
      <ServiceLogsSection
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        ownersProfiles={ownersProfilesData}
      />
      <OwnershipsSection
        carId={carId}
        carOwnerships={carOwnershipData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        ownersProfiles={ownersProfilesData}
      />
      <DeleteSection
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </section>
  );
}
