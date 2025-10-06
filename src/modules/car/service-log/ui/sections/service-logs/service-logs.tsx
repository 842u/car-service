'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { Spinner } from '@/common/presentation/decorative/spinner/spinner';
import { useToasts } from '@/common/presentation/hook/use-toasts';
import { DashboardSection } from '@/dashboard/ui/section/section';
import type { UserDto } from '@/user/application/dto/user-dto';
import { getServiceLogsByCarId } from '@/utils/supabase/tables/service_logs';
import { queryKeys } from '@/utils/tanstack/keys';

import { ServiceLogsTable } from '../../tables/service-logs/service-logs';
import type { SectionControlsProps } from './controls/controls';
import { SectionControls } from './controls/controls';

type ServiceLogsSectionProps = SectionControlsProps & {
  isCurrentUserPrimaryOwner: boolean;
  owners?: UserDto[];
};

export function ServiceLogsSection({
  carId,
  isCurrentUserPrimaryOwner,
  owners,
}: ServiceLogsSectionProps) {
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
        <ServiceLogsTable
          key={owners ? 'loaded' : 'loading'}
          isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
          owners={owners}
          serviceLogs={data}
        />
      )}
      <SectionControls carId={carId} />
    </DashboardSection>
  );
}
