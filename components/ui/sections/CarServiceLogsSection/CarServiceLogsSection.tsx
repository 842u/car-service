'use client';

import { useRef } from 'react';

import { BookIcon } from '@/components/decorative/icons/BookIcon';

import { CarServiceLogAddForm } from '../../forms/CarServiceLogAddForm/CarServiceLogAddForm';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';
import { IconButton } from '../../shared/IconButton/IconButton';

export function CarServiceLogsSection() {
  const dialogModalRef = useRef<DialogModalRef>(null);

  return (
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">
        Service Logs
      </DashboardSection.Heading>
      <DashboardSection.Controls>
        <IconButton
          title="add service log"
          variant="accent"
          onClick={() => dialogModalRef.current?.showModal()}
        >
          <BookIcon className="h-full w-full stroke-2" />
        </IconButton>
        <DialogModal ref={dialogModalRef} headingText="Add service log">
          <CarServiceLogAddForm />
        </DialogModal>
      </DashboardSection.Controls>
    </DashboardSection>
  );
}
