import {
  ComponentPropsWithoutRef,
  Ref,
  SyntheticEvent,
  useImperativeHandle,
  useRef,
} from 'react';

import { CloseBUtton } from '../CloseButton/CloseButton';

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
        <CloseBUtton onClick={closeModal} />
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
