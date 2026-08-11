import type { ComponentProps, MouseEventHandler, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import type { ButtonSizes, ButtonVariants } from '@/ui/variants/button';
import { buttonSizes, buttonVariants } from '@/ui/variants/button';

export type IconButtonProps = ComponentProps<'button'> & {
  children: ReactNode;
  title?: string;
  text?: string;
  iconSide?: 'left' | 'right';
  variant?: ButtonVariants;
  size?: ButtonSizes;
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
  size = 'md',
  disabled,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      aria-label={text ? undefined : title}
      className={twMerge(
        buttonVariants[variant],
        buttonSizes[size],
        'flex items-center justify-center gap-2 overflow-hidden',
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
