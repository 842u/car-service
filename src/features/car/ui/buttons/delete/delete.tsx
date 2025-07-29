import { twMerge } from 'tailwind-merge';

import { TrashIcon } from '@/ui/decorative/icons/trash';
import { IconButton, IconButtonProps } from '@/ui/icon-button/icon-button';

type DeleteButtonProps = Partial<IconButtonProps>;

export function DeleteButton({ className, ...props }: DeleteButtonProps) {
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
