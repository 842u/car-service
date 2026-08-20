import type { ReactNode } from 'react';

import { XCircleIcon } from '@/icons/x-circle';
import { IconButton } from '@/ui/icon-button/icon-button';
import type { HeadingLevel } from '@/ui/types/heading-level';

import { useDialogModal } from '../../use-dialog-modal';

type DialogModalHeadingProps = {
  headingLevel: HeadingLevel;
  children?: ReactNode;
};

export function DialogModalHeading({
  headingLevel,
  children,
}: DialogModalHeadingProps) {
  const { closeModal, headingId } = useDialogModal();

  const HeadingTag = headingLevel;

  return (
    <div className="flex items-end justify-between">
      <HeadingTag className="inline-block text-xl" id={headingId}>
        {children}
      </HeadingTag>
      <IconButton size="icon" title="close" onClick={closeModal}>
        <XCircleIcon className="stroke-dark-500 dark:stroke-light-500 h-full w-full stroke-2" />
      </IconButton>
    </div>
  );
}
