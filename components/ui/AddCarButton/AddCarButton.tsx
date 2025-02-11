import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { CarPlusIcon } from '@/components/decorative/icons/CarPlusIcon';

type AddCarButtonProps = ComponentProps<'button'> & {
  className?: string;
};

export function AddCarButton({ className }: AddCarButtonProps) {
  return (
    <button
      className={twMerge(
        'border-accent-400 bg-accent-800 hover:bg-accent-700 dark:bg-accent-900 dark:hover:bg-accent-800 aspect-square w-20 cursor-pointer rounded-2xl border-1 transition-colors',
        className,
      )}
    >
      <CarPlusIcon className="m-2 stroke-2" />
    </button>
  );
}
