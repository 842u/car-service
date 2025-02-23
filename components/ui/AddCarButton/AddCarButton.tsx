import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { CarPlusIcon } from '@/components/decorative/icons/CarPlusIcon';

type AddCarButtonProps = ComponentProps<'button'> & {
  className?: string;
};

export function AddCarButton({ className, ...props }: AddCarButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        'border-accent-500 bg-accent-800 aspect-square w-20 cursor-pointer rounded-2xl border-1',
        className,
      )}
    >
      <CarPlusIcon className="m-2 stroke-2" />
    </button>
  );
}
