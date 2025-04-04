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
      {...props}
      ref={dialogRef}
      className="fixed m-auto bg-transparent backdrop:backdrop-blur-xs"
      onClick={closeModal}
    >
      <div className="absolute top-0 right-0 m-4">
        <IconButton
          className="p-0"
          title="close"
          variant="accent"
          onClick={closeModal}
        >
          <XCircleIcon className="h-full w-full stroke-5" />
        </IconButton>
      </div>
      <div
        onClick={(event: SyntheticEvent) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </dialog>
  );
}
