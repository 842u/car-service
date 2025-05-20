'use client';

import { useRef } from 'react';

import { Button } from '../../shared/base/Button/Button';
import {
  DialogModal,
  DialogModalRef,
} from '../../shared/base/DialogModal/DialogModal';
import { DashboardSection } from '../../shared/DashboardSection/DashboardSection';

export function CarServiceLogsSection() {
  const dialogModalRef = useRef<DialogModalRef>(null);

  return (
    <DashboardSection>
      <DashboardSection.Heading headingLevel="h2">
        Service Logs
      </DashboardSection.Heading>
      <DashboardSection.Controls>
        <Button
          variant="accent"
          onClick={() => dialogModalRef.current?.showModal()}
        >
          Add service log
        </Button>
        <DialogModal ref={dialogModalRef} headingText="Add service log">
          Service Log Form
        </DialogModal>
      </DashboardSection.Controls>
    </DashboardSection>
  );
}
