'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useToasts } from '@/common/hooks/use-toasts';
import { Section } from '@/dashboard/ui/section/section';
import { Profile } from '@/types';
import { Spinner } from '@/ui/decorative/spinner-tempname/spinner-tempname';
import { getServiceLogsByCarId } from '@/utils/supabase/tables/service_logs';
import { queryKeys } from '@/utils/tanstack/keys';

import { ServiceLogsTable } from '../../tables/service-logs/service-logs';
import { SectionControls, SectionControlsProps } from './controls/controls';

type ServiceLogsSectionProps = SectionControlsProps & {
  isCurrentUserPrimaryOwner: boolean;
  ownersProfiles?: Profile[];
};

export function ServiceLogsSection({
  carId,
  isCurrentUserPrimaryOwner,
  ownersProfiles,
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
    <Section>
      <Section.Heading headingLevel="h2">Service Logs</Section.Heading>
      {isLoading ? (
        <Spinner className="stroke-accent-400 fill-accent-400 my-10 h-16 w-full" />
      ) : (
        <ServiceLogsTable
          key={ownersProfiles ? 'loaded' : 'loading'}
          isCurrentUserPrimaryOwner={isCurrentUserPrimaryOwner}
          ownersProfiles={ownersProfiles}
          serviceLogs={data}
        />
      )}
      <SectionControls carId={carId} />
    </Section>
  );
}
