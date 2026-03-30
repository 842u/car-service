'use client';

import { OwnershipsSection } from '@/car/ownership/ui/sections/ownerships/ownerships';
import { CarCostsSection } from '@/car/service-log/ui/sections/car-costs/car-costs';
import { ServiceLogsSection } from '@/car/service-log/ui/sections/service-logs/service-logs';
import { DetailsSection } from '@/car/ui/sections/details/details';
import { DashboardSection } from '@/dashboard/ui/section/section';

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
    <DashboardSection
      className="flex flex-col gap-5 lg:grid lg:max-w-7xl lg:grid-cols-[auto_1fr_auto] lg:gap-5"
      variant="raw"
    >
      <DetailsSection
        carData={carData}
        className="lg:col-span-3 lg:w-auto"
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
      <ServiceLogsSection
        carId={carId}
        className="lg:col-span-3"
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        owners={ownersProfilesData}
      />
      <OwnershipsSection
        carId={carId}
        carOwnerships={carOwnershipData}
        className="lg:col-span-2"
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        owners={ownersProfilesData}
      />
      <CarCostsSection carId={carId} className="lg:col-span-1" />
      <DeleteSection
        carId={carId}
        className="lg:col-span-3"
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
      />
    </DashboardSection>
  );
}
