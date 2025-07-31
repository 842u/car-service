import type { ComponentProps, MouseEventHandler, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ButtonVariants } from '@/types';
import { buttonVariants } from '@/utils/tailwindcss/button';

export type IconButtonProps = ComponentProps<'button'> & {
  children: ReactNode;
  title?: string;
  text?: string;
  iconSide?: 'left' | 'right';
  variant?: ButtonVariants;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
};

export function IconButton({
  title,
  children,
  onClick,
  text,
  iconSide = 'right',
  variant = 'default',
  disabled,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={title}
      className={twMerge(
        buttonVariants[variant],
        'flex items-center justify-center gap-2 overflow-hidden px-3 py-1',
        className,
      )}
      disabled={disabled}
      title={title}
      type="button"
      onClick={onClick}
      {...props}
    >
      {iconSide === 'left' && children}
      {text && <span className="whitespace-nowrap">{text}</span>}
      {iconSide === 'right' && children}
    </button>
  );
}
