import { ReactNode } from 'react';

import { useDialogModal } from './dialog-modal';

type ControlsProps = {
  children?: ReactNode;
};

export function Controls({ children }: ControlsProps) {
  useDialogModal();

  return (
    <div className="flex w-full flex-col gap-4 md:flex-row md:justify-end md:px-4">
      {children}
    </div>
  );
}
