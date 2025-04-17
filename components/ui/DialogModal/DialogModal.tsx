import {
  ComponentPropsWithoutRef,
  Ref,
  SyntheticEvent,
  useImperativeHandle,
  useRef,
} from 'react';

import { XCircleIcon } from '@/components/decorative/icons/XCircleIcon';

import { IconButton } from '../IconButton/IconButton';

export type DialogModalRef = {
  showModal: () => void;
  closeModal: () => void;
};

type DialogModalProps = ComponentPropsWithoutRef<'dialog'> & {
  ref?: Ref<DialogModalRef>;
};

export function DialogModal({ children, ref, ...props }: DialogModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const closeModal = () => dialogRef.current?.close();

  useImperativeHandle(ref, () => {
    return {
      showModal() {
        dialogRef.current?.showModal();
      },
      closeModal,
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      className="bg-light-500 dark:bg-dark-500 border-accent-200 dark:border-accent-300 fixed m-auto w-full rounded-md border-2 p-4 backdrop:backdrop-blur-xs"
      onClick={closeModal}
      {...props}
    >
      <div className="absolute top-0 right-0 m-4">
        <IconButton className="p-1" title="close" onClick={closeModal}>
          <XCircleIcon className="stroke-dark-500 dark:stroke-light-500 h-full w-full stroke-2" />
        </IconButton>
      </div>
      <div
        onClick={(event: SyntheticEvent<HTMLDivElement>) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </dialog>
  );
}
