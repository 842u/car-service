'use client';

import { useRef } from 'react';

import { Main } from '@/dashboard/ui/main/main';
import { CarAddButton } from '@/features/car/ui/CarAddButton/CarAddButton';
import { CarAddModal } from '@/features/car/ui/CarAddModal/CarAddModal';
import { CarsGallery } from '@/features/car/ui/CarsGallery/CarsGallery';
import { DialogModalRef } from '@/ui/dialog-modal/dialog-modal';

export default function CarsPage() {
  const dialogRef = useRef<DialogModalRef>(null);

  const handleCarAddButtonClick = () => dialogRef.current?.showModal();

  const handleCarAddModalSubmit = () => dialogRef.current?.closeModal();

  return (
    <Main>
      <CarsGallery />
      <CarAddModal ref={dialogRef} onSubmit={handleCarAddModalSubmit} />
      <CarAddButton
        className="fixed right-0 bottom-0 mx-4 my-12 md:m-12 lg:m-16"
        onClick={handleCarAddButtonClick}
      />
    </Main>
  );
}
