import {
  ComponentPropsWithoutRef,
  Ref,
  SyntheticEvent,
  useImperativeHandle,
  useRef,
} from 'react';

export type DialogModalRef = {
  showModal: () => void;
};

type DialogModalProps = ComponentPropsWithoutRef<'dialog'> & {
  ref?: Ref<DialogModalRef>;
};

export function DialogModal({ children, ref, ...props }: DialogModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useImperativeHandle(ref, () => {
    return {
      showModal() {
        dialogRef.current?.showModal();
      },
    };
  }, []);

  return (
    <dialog
      {...props}
      ref={dialogRef}
      className="m-auto backdrop:backdrop-blur-xs"
      onClick={() => dialogRef.current?.close()}
    >
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
