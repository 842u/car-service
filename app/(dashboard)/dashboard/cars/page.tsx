'use client';

import { useRef } from 'react';

import { AddCarButton } from '@/components/ui/AddCarButton/AddCarButton';
import { AddCarForm } from '@/components/ui/AddCarForm/AddCarForm';
import { CarsSection } from '@/components/ui/CarsSection/CarsSection';
import {
  DialogModal,
  DialogModalRef,
} from '@/components/ui/DialogModal/DialogModal';

export default function CarsPage() {
  const dialogModalRef = useRef<DialogModalRef>(null);

  return (
    <main className="flex min-h-screen max-w-screen items-center justify-center pt-16 md:pl-16">
      <CarsSection />
      <DialogModal ref={dialogModalRef}>
        <AddCarForm onSubmit={() => dialogModalRef.current?.closeModal()} />
      </DialogModal>
      <AddCarButton
        className="fixed right-0 bottom-40 m-4 w-16 md:m-8 lg:m-12"
        onClick={() => {
          dialogModalRef.current?.showModal();
        }}
      />
    </main>
  );
}
