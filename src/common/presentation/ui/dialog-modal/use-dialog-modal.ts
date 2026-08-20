import type { RefObject } from 'react';
import { createContext } from 'react';

import { useContextGuard } from '@/common/presentation/hook/use-context-guard';

export type DialogModalRef = {
  showModal: () => void;
  closeModal: () => void;
};

export type DialogModalContextValue = DialogModalRef & {
  dialogRef: RefObject<HTMLDialogElement | null>;
  headingId: string;
};

export const DialogModalContext = createContext<DialogModalContextValue | null>(
  null,
);

export function useDialogModal() {
  return useContextGuard({
    context: DialogModalContext,
    componentName: 'DialogModal',
  });
}
