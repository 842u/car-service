import {
  createContext,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';

import { useContextGuard } from '@/common/hooks/use-context-guard';

import { Controls } from './compounds/controls/controls';
import { Heading } from './compounds/heading/heading';
import { Root } from './compounds/root/root';

export type DialogModalRef = {
  showModal: () => void;
  closeModal: () => void;
};

type DialogModalContextValue = DialogModalRef & {
  dialogRef: RefObject<HTMLDialogElement | null>;
};

export type DialogModalProps = {
  ref?: RefObject<DialogModalRef | null>;
  children?: ReactNode;
};

const DialogModalContext = createContext<DialogModalContextValue | null>(null);

export function useDialogModal() {
  return useContextGuard({
    context: DialogModalContext,
    componentName: 'DialogModal',
  });
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

DialogModal.Root = Root;
DialogModal.Heading = Heading;
DialogModal.Controls = Controls;
