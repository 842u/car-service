import { ComponentProps, MouseEventHandler, ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

import { ButtonVariants } from '@/types';
import { buttonVariants } from '@/utils/tailwindcss/button';

type IconButtonProps = {
  title: string;
  children: ReactElement<ComponentProps<'svg'>, 'svg'>;
  variant?: ButtonVariants;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
};

export function IconButton({
  title,
  children,
  onClick,
  variant = 'default',
  disabled,
  className,
}: IconButtonProps) {
  return (
    <button
      aria-label={title}
      className={twMerge(
        buttonVariants[variant],
        'overflow-hidden px-3 py-1',
        className,
      )}
      disabled={disabled}
      title={title}
      type="button"
      onClick={onClick}
    >
      {children}
      <span className="sr-only">{title}</span>
    </button>
  );
}
