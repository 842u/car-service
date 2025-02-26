'use client';

import { useQuery } from '@tanstack/react-query';
import { useRef } from 'react';

import { AddCarButton } from '@/components/ui/AddCarButton/AddCarButton';
import { AddCarForm } from '@/components/ui/AddCarForm/AddCarForm';
import {
  DialogModal,
  DialogModalRef,
} from '@/components/ui/DialogModal/DialogModal';
import { createClient } from '@/utils/supabase/client';

const fetchCars = async () => {
  const supabase = createClient();

  const { data, error } = await supabase.from('cars').select();

  if (error) throw new Error(error.message);

  return data;
};

export default function CarsPage() {
  const addCarModalRef = useRef<DialogModalRef>(null);

  const { data } = useQuery({ queryKey: ['cars'], queryFn: fetchCars });

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      {data?.map((car) => <p key={car.id}>{car.id}</p>)}
      <DialogModal ref={addCarModalRef}>
        <AddCarForm />
      </DialogModal>
      <AddCarButton
        className="fixed right-0 bottom-0 m-4 md:m-8 lg:m-12"
        onClick={() => {
          addCarModalRef.current?.showModal();
        }}
      />
    </main>
  );
}
