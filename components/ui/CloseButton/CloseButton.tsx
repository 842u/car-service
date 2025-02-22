import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

import { XCircleIcon } from '@/components/decorative/icons/XCircleIcon';

import { Button } from '../Button/Button';

type AddCarButtonProps = ComponentProps<'button'> & {
  className?: string;
};

export function CloseBUtton({ className, ...props }: AddCarButtonProps) {
  return (
    <Button
      aria-label="close dialog modal"
      className={twMerge(
        'border-accent-500 bg-accent-800 aspect-square cursor-pointer rounded-lg border-1 p-0',
        className,
      )}
      type="button"
      {...props}
    >
      <XCircleIcon className="stroke-light-500 stroke-5 transition-colors" />
    </Button>
  );
}
