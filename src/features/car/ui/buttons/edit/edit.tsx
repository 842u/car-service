import { twMerge } from 'tailwind-merge';

import { CarEditIcon } from '@/ui/decorative/icons/car-edit';
import { IconButton, IconButtonProps } from '@/ui/icon-button/icon-button';

type EditButtonProps = Partial<IconButtonProps>;

export function EditButton({ className, ...props }: EditButtonProps) {
  return (
    <IconButton
      className={twMerge('group', className)}
      text="Edit car"
      variant="accent"
      {...props}
    >
      <CarEditIcon className="group-disabled:stroke-light-800 stroke-light-500 fill-light-500 h-full stroke-[0.5] py-0.5" />
    </IconButton>
  );
}
