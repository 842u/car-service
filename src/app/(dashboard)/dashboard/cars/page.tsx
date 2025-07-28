'use client';

import { useRef } from 'react';

import { CarAddButton } from '@/features/car/ui/CarAddButton/CarAddButton';
import { CarAddModal } from '@/features/car/ui/CarAddModal/CarAddModal';
import { CarsGallery } from '@/features/car/ui/CarsGallery/CarsGallery';
import { DialogModalRef } from '@/features/common/ui/dialog-modal/dialog-modal';
import { DashboardMain } from '@/features/dashboard/ui/DashboardMain/DashboardMain';

export default function CarsPage() {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleCarAddButtonClick = () => dialogRef.current?.showModal();

  const handleCarAddModalSubmit = () => dialogRef.current?.closeModal();

  return (
    <DashboardMain>
      <CarsGallery />
      <CarAddModal ref={dialogRef} onSubmit={handleCarAddModalSubmit} />
      <CarAddButton
        className="fixed right-0 bottom-0 mx-4 my-12 md:m-12 lg:m-16"
        onClick={handleCarAddButtonClick}
      />
    </DashboardMain>
  );
}
