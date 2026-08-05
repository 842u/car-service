/* eslint-disable
 jsx-a11y/click-events-have-key-events,
 jsx-a11y/no-noninteractive-element-interactions,
 jsx-a11y/no-static-element-interactions  */
import type { ComponentProps, MouseEvent, ReactNode } from 'react';

import { useDialogModal } from '../../dialog-modal';

type DialogModalRootProps = ComponentProps<'dialog'> & {
  children?: ReactNode;
};

export function DialogModalRoot({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  ...props
}: DialogModalRootProps) {
  const { closeModal, dialogRef, headingId } = useDialogModal();

  return (
    <dialog
      ref={dialogRef}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabel ? undefined : (ariaLabelledBy ?? headingId)}
      className="bg-light-500 dark:bg-dark-500 border-accent-200 dark:border-accent-300 fixed m-auto w-full rounded-md border backdrop:backdrop-blur-xs md:w-fit"
      onClick={closeModal}
      {...props}
    >
      <div
        className="p-4"
        onClick={(event: MouseEvent) => {
          event.stopPropagation();
        }}
      >
        {children}
      </div>
    </dialog>
  );
}
