'use client';

import { OwnershipsSection } from '@/car/ownership/ui/sections/ownerships/ownerships';
import { ServiceLogsSection } from '@/car/service-log/ui/sections/service-logs/service-logs';
import { DetailsSection } from '@/car/ui/sections/details/details';

import { DeleteSection } from '../delete/delete';
import { useSettingsSection } from './use-settings';

export type SettingsSectionProps = {
  carId: string;
};

export function SettingsSection({ carId }: SettingsSectionProps) {
  const {
    carData,
    isCurrentUserPrimaryOwner,
    carOwnershipData,
    ownersProfilesData,
  } = useSettingsSection({ carId });

  return (
    <section className="flex w-full flex-col gap-5 p-5">
      <DetailsSection
        carData={carData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
      <ServiceLogsSection
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        owners={ownersProfilesData}
      />
      <OwnershipsSection
        carId={carId}
        carOwnerships={carOwnershipData}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        owners={ownersProfilesData}
      />
      <DeleteSection
        carId={carId}
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </section>
  );
}
