'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/features/common/hooks/useToasts';
import { Spinner } from '@/features/common/ui/decorative/Spinner/Spinner';
import { Profile } from '@/types';
import { getServiceLogsByCarId } from '@/utils/supabase/tables/service_logs';
import { queryKeys } from '@/utils/tanstack/keys';

import { DashboardSection } from '../../../../features/dashboard/ui/DashboardSection/DashboardSection';
import { CarServiceLogsTable } from '../../tables/CarServiceLogsTable/CarServiceLogsTable';
import {
  CarServiceLogsSectionControls,
  CarServiceLogsSectionControlsProps,
} from './CarServiceLogsSectionControls/CarServiceLogsSectionControls';

type CarServiceLogsSectionProps = CarServiceLogsSectionControlsProps & {
  isCurrentUserPrimaryOwner: boolean;
  ownersProfiles?: Profile[];
};

export function CarServiceLogsSection({
  carId,
  isCurrentUserPrimaryOwner,
  ownersProfiles,
}: CarServiceLogsSectionProps) {
  const { addToast } = useToasts();

  const { data, error, isLoading } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.serviceLogsByCarId(carId),
    queryFn: () => getServiceLogsByCarId(carId),
  });

  useEffect(() => {
    error && addToast(error.message, 'error');
  }, [addToast, error]);

  return (
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">
        Service Logs
      </DashboardSection.Heading>
      {isLoading ? (
        <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
      ) : (
        <CarServiceLogsTable
          key={ownersProfiles ? 'loaded' : 'loading'}
          isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
          ownersProfiles={ownersProfiles}
          serviceLogs={data}
        />
      )}
      <CarServiceLogsSectionControls carId={carId} />
    </DashboardSection>
  );
}
