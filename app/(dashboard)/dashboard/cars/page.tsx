'use client';

import { useRef } from 'react';

import { AddCarButton } from '@/components/ui/AddCarButton/AddCarButton';
import {
  DialogModal,
  DialogModalRef,
} from '@/components/ui/DialogModal/DialogModal';

export default function CarsPage() {
  const addCarModalRef = useRef<DialogModalRef>(null);

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      <DialogModal ref={addCarModalRef}>
        <p className="w-96">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero aliquid,
          at, non laudantium nulla numquam ut cumque, corrupti eos fugiat totam
          blanditiis! Architecto, in, ratione cupiditate, repudiandae dolorum
          non quam eveniet eaque ex asperiores ea tenetur suscipit voluptatibus.
          Sit molestiae assumenda quod modi perferendis a sequi nesciunt
          doloribus culpa quam quas perspiciatis consequatur odit distinctio
          obcaecati, quo corporis provident voluptate, qui suscipit ipsum. At
          nobis exercitationem commodi illum odio quia sed. Autem minus sapiente
          laboriosam fuga necessitatibus ratione quibusdam reiciendis labore
          quaerat, aliquam facere repellendus atque illum cumque magni saepe
          doloribus sit recusandae, aliquid laudantium corrupti. Sit,
          reiciendis. Modi, fugiat!
        </p>
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
