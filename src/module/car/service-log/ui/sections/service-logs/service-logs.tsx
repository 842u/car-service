'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { getServiceLogsByCarId } from '@/lib/supabase/tables/service_logs';
import { queryKeys } from '@/lib/tanstack/keys';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import type { UserDto } from '@/user/application/dto/user';

import { ServiceLogsTable } from '../../tables/service-logs/service-logs';
import type { SectionControlsProps } from './controls/controls';
import { SectionControls } from './controls/controls';

type ServiceLogsSectionProps = SectionControlsProps & {
  isCurrentUserPrimaryOwner: boolean;
  owners?: UserDto[];
  className?: string;
};

export function ServiceLogsSection({
  carId,
  isCurrentUserPrimaryOwner,
  owners,
  className,
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
    <DashboardSection aria-label="Service logs" className={className}>
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
