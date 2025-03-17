import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { CarEditIcon } from '@/components/decorative/icons/CarEditIcon';

type CarDetailsButtonProps = ComponentProps<'button'> & {
  className?: string;
};

export function CarEditButton({ className, ...props }: CarDetailsButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        'border-accent-500 bg-accent-800 aspect-square w-20 cursor-pointer rounded-2xl border-1',
        className,
      )}
    >
      <CarEditIcon className="m-2 stroke-2" />
    </button>
  );
}
