import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { CarDetailsIcon } from '@/components/decorative/icons/CarDetailsIcon';

type CarDetailsButtonProps = ComponentProps<'button'> & {
  className?: string;
};

export function CarDetailsButton({
  className,
  ...props
}: CarDetailsButtonProps) {
  return (
    <button
      {...props}
      className={twMerge(
        'border-accent-500 bg-accent-800 aspect-square w-20 cursor-pointer rounded-2xl border-1',
        className,
      )}
    >
      <CarDetailsIcon className="m-2 stroke-2" />
    </button>
  );
}
