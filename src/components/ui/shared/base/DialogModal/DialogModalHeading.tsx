import { ReactNode } from 'react';

import { XCircleIcon } from '@/features/common/ui/decorative/icons/XCircleIcon';

import { IconButton } from '../../IconButton/IconButton';
import { useDialogModal } from './DialogModal';

type DialogModalHeadingProps = {
  headingLevel?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children?: ReactNode;
};

export function DialogModalHeading({
  headingLevel = 'h2',
  children,
}: DialogModalHeadingProps) {
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
