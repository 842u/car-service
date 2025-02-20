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
      className="m-auto bg-transparent backdrop:backdrop-blur-xs"
      onClick={closeModal}
    >
      <div
        onClick={(event: SyntheticEvent) => {
          event.stopPropagation();
        }}
      >
        <div className="m-2 place-self-end">
          <CloseBUtton onClick={closeModal} />
        </div>
        {children}
      </div>
    </dialog>
  );
}
