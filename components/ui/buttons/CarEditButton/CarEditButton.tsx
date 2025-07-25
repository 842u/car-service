import { twMerge } from 'tailwind-merge';

import { CarEditIcon } from '@/components/decorative/icons/CarEditIcon';

import {
  IconButton,
  IconButtonProps,
} from '../../shared/IconButton/IconButton';

type CarEditButtonProps = Partial<IconButtonProps>;

export function CarEditButton({ className, ...props }: CarEditButtonProps) {
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
