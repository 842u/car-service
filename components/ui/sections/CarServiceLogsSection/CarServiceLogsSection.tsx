'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { BookIcon } from '@/components/decorative/icons/BookIcon';
import { Spinner } from '@/components/decorative/Spinner/Spinner';
import { useToasts } from '@/hooks/useToasts';
import { Profile } from '@/types';
import { getServiceLogsByCarId } from '@/utils/supabase/tables/service_logs';
import { queryKeys } from '@/utils/tanstack/keys';

import { CarServiceLogAddForm } from '../../forms/CarServiceLogAddForm/CarServiceLogAddForm';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { IconButton } from '../../shared/IconButton/IconButton';
import { CarServiceLogsTable } from '../../tables/CarServiceLogsTable/CarServiceLogsTable';

type CarServiceLogsSectionProps = {
  carId: string;
  isCurrentUserPrimaryOwner: boolean;
  ownersProfiles?: Profile[];
};

export function CarServiceLogsSection({
  carId,
  isCurrentUserPrimaryOwner,
  ownersProfiles,
}: CarServiceLogsSectionProps) {
  const dialogModalRef = useRef<DialogModalRef>(null);

  const { addToast } = useToasts();

  const { data, error, isLoading } = useQuery({
    throwOnError: false,
    queryKey: queryKeys.serviceLogsByCarId(carId),
    queryFn: () => getServiceLogsByCarId(carId),
  });

  useEffect(() => {
    error && addToast(error.message, 'error');
  }, [addToast, error]);

  const handleModalClose = () => dialogModalRef.current?.closeModal();

  const handleModalOpen = () => dialogModalRef.current?.showModal();

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
      <DashboardSection.Controls>
        <IconButton
          title="add service log"
          variant="accent"
          onClick={handleModalOpen}
        >
          <BookIcon className="h-full w-full stroke-2" />
        </IconButton>
        <DialogModal ref={dialogModalRef} headingText="Add service log">
          <CarServiceLogAddForm carId={carId} onSubmit={handleModalClose} />
        </DialogModal>
      </DashboardSection.Controls>
    </DashboardSection>
  );
}
