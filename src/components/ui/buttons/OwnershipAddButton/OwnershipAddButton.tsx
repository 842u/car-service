import { twMerge } from 'tailwind-merge';

import { UserPlusIcon } from '@/components/decorative/icons/UserPlusIcon';

import {
  IconButton,
  IconButtonProps,
} from '../../shared/IconButton/IconButton';

type OwnershipAddButtonProps = Partial<IconButtonProps>;

export function OwnershipAddButton({
  className,
  ...props
}: OwnershipAddButtonProps) {
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
