import {
  createContext,
  ReactNode,
  Ref,
  use,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import { DialogModalControls } from './DialogModalControls';
import { DialogModalHeading } from './DialogModalHeading';
import { DialogModalRoot } from './DialogModalRoot';

export type DialogModalRef = {
  showModal: () => void;
  closeModal: () => void;
};

type DialogModalContextValue = DialogModalRef & {
  dialogRef: Ref<HTMLDialogElement>;
};

export type DialogModalProps = {
  ref?: Ref<DialogModalRef>;
  children?: ReactNode;
};

const DialogModalContext = createContext<DialogModalContextValue | null>(null);

export function useDialogModal() {
  const context = use(DialogModalContext);

  if (!context)
    throw new Error(
      'DialogModal related components should be wrapped in <DialogModal>.',
    );

  return context;
}

export function DialogModal({ ref, children }: DialogModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const showModal = useCallback(
    () => dialogRef.current?.showModal() || (() => {}),
    [],
  );

  const closeModal = useCallback(
    () => dialogRef.current?.close() || (() => {}),
    [],
  );

  const contextValue: DialogModalContextValue = useMemo(
    () => ({
      showModal,
      closeModal,
      dialogRef,
    }),
    [showModal, closeModal],
  );

  useImperativeHandle(ref, () => {
    return contextValue;
  }, [contextValue]);

  useEffect(() => {
    const dialogElement = dialogRef.current;

    if (!dialogElement) return;

    const handleOpenChange = () => {
      if (dialogElement.open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };

    const observer = new MutationObserver(handleOpenChange);

    observer.observe(dialogElement, {
      attributes: true,
      attributeFilter: ['open'],
    });

    handleOpenChange();

    return () => {
      document.body.style.overflow = 'auto';

      observer.disconnect();
    };
  }, []);

  return (
    <DialogModalContext value={contextValue}>{children}</DialogModalContext>
  );
}

DialogModal.Root = DialogModalRoot;
DialogModal.Heading = DialogModalHeading;
DialogModal.Controls = DialogModalControls;
