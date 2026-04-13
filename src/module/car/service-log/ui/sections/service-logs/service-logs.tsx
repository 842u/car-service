'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/presentation/hook/use-toasts';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { BookIcon } from '@/icons/book';
import { getServiceLogsByCarId } from '@/lib/supabase/tables/service_logs';
import { queryKeys } from '@/lib/tanstack/keys';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import { EmptyStatePlaceholder } from '@/ui/empty-state-placeholder/empty-state-placeholder';
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

  if (isLoading) {
    return (
      <DashboardSection aria-label="Service logs" className={className}>
        <DashboardSection.Heading headingLevel="h2">
          Service Logs
        </DashboardSection.Heading>
        <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
      </DashboardSection>
    );
  }

  if (!data?.length) {
    return (
      <DashboardSection aria-label="Service logs" className={className}>
        <DashboardSection.Heading headingLevel="h2">
          Service Logs
        </DashboardSection.Heading>
        <EmptyStatePlaceholder
          className="my-5 h-fit"
          icon={BookIcon}
          subtext="You haven't added any service logs. Once you do, they will appear here."
          text="No service logs data yet"
        />
        <SectionControls carId={carId} />
      </DashboardSection>
    );
  }

  return (
    <DashboardSection aria-label="Service logs" className={className}>
      <DashboardSection.Heading headingLevel="h2">
        Service Logs
      </DashboardSection.Heading>
      <ServiceLogsTable
        key={owners ? 'loaded' : 'loading'}
        className="my-5 max-h-96 overflow-auto [scrollbar-gutter:stable]"
        isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
        owners={owners}
        serviceLogs={data}
      />
      <SectionControls carId={carId} />
    </DashboardSection>
  );
}
