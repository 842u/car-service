import type { ReactNode, RefObject } from 'react';
import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import { Controls } from './compounds/controls/controls';
import { DialogModalHeading } from './compounds/heading/heading';
import { DialogModalRoot } from './compounds/root/root';
import type {
  DialogModalContextValue,
  DialogModalRef,
} from './use-dialog-modal';
import { DialogModalContext } from './use-dialog-modal';

type DialogModalProps = {
  ref?: RefObject<DialogModalRef | null>;
  children?: ReactNode;
};

export function DialogModal({ ref, children }: DialogModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingId = useId();

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
      headingId,
    }),
    [showModal, closeModal, headingId],
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
DialogModal.Controls = Controls;
