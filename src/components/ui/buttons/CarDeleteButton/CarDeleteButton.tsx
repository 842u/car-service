import { twMerge } from 'tailwind-merge';

import { TrashIcon } from '@/components/decorative/icons/TrashIcon';

import {
  IconButton,
  IconButtonProps,
} from '../../shared/IconButton/IconButton';

type CarDeleteButtonProps = Partial<IconButtonProps>;

export function CarDeleteButton({ className, ...props }: CarDeleteButtonProps) {
  return (
    <IconButton
      className={twMerge('group', className)}
      text="Delete car"
      variant="error"
      {...props}
    >
      <TrashIcon className="group-disabled:stroke-light-800 h-full stroke-2 py-0.5" />
    </IconButton>
  );
}
