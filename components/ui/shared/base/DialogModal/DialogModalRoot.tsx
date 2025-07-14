import { MouseEvent, ReactNode } from 'react';

import { useDialogModal } from './DialogModal';

type DialogModalRootProps = {
  children?: ReactNode;
};

export function DialogModalRoot({ children }: DialogModalRootProps) {
  const { closeModal, dialogRef } = useDialogModal();

  return (
    <dialog
      ref={dialogRef}
      className="bg-light-500 dark:bg-dark-500 border-accent-200 dark:border-accent-300 fixed m-auto w-full rounded-md border backdrop:backdrop-blur-xs md:w-fit"
      onClick={closeModal}
    >
      <div
        className="p-4"
        onClick={(event: MouseEvent) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </dialog>
  );
}
