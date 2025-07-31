import { twMerge } from 'tailwind-merge';

import { UserPlusIcon } from '@/icons/user-plus';
import { IconButton, IconButtonProps } from '@/ui/icon-button/icon-button';

type AddButtonProps = Partial<IconButtonProps>;

export function AddButton({ className, ...props }: AddButtonProps) {
  return (
    <IconButton
      className={twMerge('group', className)}
      text="Add owner"
      variant="accent"
      {...props}
    >
      <UserPlusIcon className="group-disabled:stroke-light-800 h-full stroke-2 py-0.5" />
    </IconButton>
  );
}
