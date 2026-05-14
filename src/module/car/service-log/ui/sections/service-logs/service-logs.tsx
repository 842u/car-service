'use client';

import { useServiceLogsSection } from '@/car/service-log/ui/sections/service-logs/use-service-logs';
import { DashboardSection } from '@/dashboard/ui/section/section';
import { BookIcon } from '@/icons/book';
import { Spinner } from '@/ui/decorative/spinner/spinner';
import { EmptyStatePlaceholder } from '@/ui/empty-state-placeholder/empty-state-placeholder';

import { ServiceLogsTable } from '../../tables/service-logs/service-logs';
import { SectionControls } from './controls/controls';

interface ServiceLogsSectionProps {
  carId: string;
  className?: string;
}

export function ServiceLogsSection({
  carId,
  className,
}: ServiceLogsSectionProps) {
  const {
    isLoading,
    serviceLogs,
    users,
    isSessionUserPrimaryOwner,
    sessionUserId,
  } = useServiceLogsSection({ carId });

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

  if (!serviceLogs?.length) {
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
        className="my-5 max-h-96 overflow-auto [scrollbar-gutter:stable]"
        isSessionUserPrimaryOwner={isSessionUserPrimaryOwner}
        serviceLogs={serviceLogs}
        sessionUserId={sessionUserId}
        users={users}
      />
      <SectionControls carId={carId} />
    </DashboardSection>
  );
}
