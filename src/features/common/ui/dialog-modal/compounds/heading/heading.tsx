import { ReactNode } from 'react';

import { XCircleIcon } from '@/icons/x-circle';
import { IconButton } from '@/ui/icon-button/icon-button';

import { useDialogModal } from '../../dialog-modal';

type HeadingProps = {
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children?: ReactNode;
};

export function Heading({ headingLevel = 'h2', children }: HeadingProps) {
  const { closeModal } = useDialogModal();

  const HeadingTag = headingLevel;

  return (
    <div className="flex items-end justify-between">
      <HeadingTag className="inline-block text-xl">{children}</HeadingTag>
      <IconButton className="p-1" title="close" onClick={closeModal}>
        <XCircleIcon className="stroke-dark-500 dark:stroke-light-500 h-full w-full stroke-2" />
      </IconButton>
    </div>
  );
}
