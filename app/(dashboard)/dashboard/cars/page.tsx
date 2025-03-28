'use client';

import { useRef } from 'react';

import { AddCarButton } from '@/components/ui/AddCarButton/AddCarButton';
import { CarForm } from '@/components/ui/CarForm/CarForm';
import { CarsSection } from '@/components/ui/CarsSection/CarsSection';
import { DashboardMain } from '@/components/ui/DashboardMain/DashboardMain';
import {
  DialogModal,
  DialogModalRef,
} from '@/components/ui/DialogModal/DialogModal';

export default function CarsPage() {
  const dialogModalRef = useRef<DialogModalRef>(null);

  return (
    <DashboardMain>
      <CarsSection />
      <DialogModal ref={dialogModalRef}>
        <CarForm onSubmit={() => dialogModalRef.current?.closeModal()} />
      </DialogModal>
      <AddCarButton
        className="fixed right-0 bottom-40 m-4 w-16 md:m-8 lg:m-12"
        onClick={() => {
          dialogModalRef.current?.showModal();
        }}
      />
    </DashboardMain>
  );
}
