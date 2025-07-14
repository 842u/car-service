'use client';

import { useRef } from 'react';

import { CarAddButton } from '@/components/ui/buttons/CarAddButton/CarAddButton';
import { CarsGallery } from '@/components/ui/CarsGallery/CarsGallery';
import { CarAddForm } from '@/components/ui/forms/CarAddForm/CarAddForm';
import {
  DialogModal,
  DialogModalRef,
} from '@/components/ui/shared/base/DialogModal/DialogModal';
import { DashboardMain } from '@/components/ui/shared/DashboardMain/DashboardMain';

export default function CarsPage() {
  const dialogModalRef = useRef<DialogModalRef>(null);

  return (
    <DashboardMain>
      <CarsGallery />
      <DialogModal ref={dialogModalRef} headingText="Add a car">
        <CarAddForm onSubmit={() => dialogModalRef.current?.closeModal()} />
      </DialogModal>
      <CarAddButton
        className="fixed right-0 bottom-0 mx-4 my-12 md:m-12 lg:m-16"
        onClick={() => dialogModalRef.current?.showModal()}
      />
    </DashboardMain>
  );
}
