'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { BookIcon } from '@/components/decorative/icons/BookIcon';
import { useToasts } from '@/hooks/useToasts';
import { getServiceLogsByCarId } from '@/utils/supabase/tables/service_logs';
import { queryKeys } from '@/utils/tanstack/keys';

import { CarServiceLogAddForm } from '../../forms/CarServiceLogAddForm/CarServiceLogAddForm';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { IconButton } from '../../shared/IconButton/IconButton';

type CarServiceLogsSectionProps = {
  carId: string;
};

export function CarServiceLogsSection({ carId }: CarServiceLogsSectionProps) {
  const dialogModalRef = useRef<DialogModalRef>(null);

  const { addToast } = useToasts();

  const { data, error } = useQuery({
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
      {data?.map((log) => <p key={log.id}>{`${log.id}: ${log.notes}`}</p>)}
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
