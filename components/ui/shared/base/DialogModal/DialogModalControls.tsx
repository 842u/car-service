import { ReactNode } from 'react';

import { useDialogModal } from './DialogModal';

type DialogModalControlsProps = {
  children?: ReactNode;
};

export function DialogModalControls({ children }: DialogModalControlsProps) {
  useDialogModal();

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row md:justify-end md:px-4">
      {children}
    </div>
  );
}
